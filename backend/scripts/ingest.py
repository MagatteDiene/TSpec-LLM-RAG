"""
ingest.py — Pipeline d'ingestion RAG version production pour TSpec-LLM (Local Dataset).

Nouvelle implémentation pour lire les fichiers locaux depuis le dossier cloné HuggingFace.
Le dataset est un dépôt git LFS organisé avec des dossiers `3GPP-clean/Rel-*/<series>/*.md`.

Fonctionnalités :
- Streaming/générateur local (Lecture fichier par fichier pour faible empreinte RAM).
- Checkpointing basé sur les chemins de fichiers.
- Chunking optimisé avec chevauchement (overlap).
- Traitement par lots (batching) pour ChromaDB.
- Journalisation (logging) détaillée et résilience.
"""

import os
import sys
import json
import time
import logging
from pathlib import Path

import chromadb
from sentence_transformers import SentenceTransformer
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Lier aux configurations du projet
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.core.config import settings

# --- Configuration de la journalisation (Logging) ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("ingest.log", encoding="utf-8")
    ]
)
logger = logging.getLogger("IngestPipelineLocal")

# --- Paramètres de production ---
OVERLAP_SIZE = 50           
MAX_RETRIES = 3             
CHECKPOINT_FILE = Path(settings.CHROMA_DIR) / "ingest_checkpoint_local.json"
DATASET_DIR = Path(__file__).parent.parent / "dataset_local" / "3GPP-clean"

class IngestionPipelineLocal:
    def __init__(self):
        logger.info(f"Initialisation du pipeline d'ingestion local (Modèle: {settings.EMBED_MODEL_NAME}).")
        
        self.encoder = SentenceTransformer(settings.EMBED_MODEL_NAME)
        
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=OVERLAP_SIZE,
            separators=["\n\n", "\n", ".", " ", ""]
        )
        
        os.makedirs(settings.CHROMA_DIR, exist_ok=True)
        self.chroma_client = chromadb.PersistentClient(path=settings.CHROMA_DIR)
        self.collection = self.chroma_client.get_or_create_collection(
            name=settings.COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"}
        )

        self.processed_files = self._load_checkpoint()

    def _load_checkpoint(self) -> set:
        """Charge l'ensemble des fichiers déjà traités avec succès."""
        if CHECKPOINT_FILE.exists():
            try:
                with open(CHECKPOINT_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    files = set(data.get("processed_files", []))
                    logger.info(f"Checkpoint trouvé. {len(files)} fichiers déjà ingérés.")
                    return files
            except json.JSONDecodeError:
                logger.warning("Fichier de checkpoint corrompu. Redémarrage à 0.")
        return set()

    def _save_checkpoint(self):
        """Sauvegarde atomique de la liste des fichiers traités."""
        temp_file = CHECKPOINT_FILE.with_suffix('.tmp')
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump({"processed_files": list(self.processed_files), "timestamp": time.time()}, f)
        temp_file.replace(CHECKPOINT_FILE)

    def _process_batch(self, batch_docs: list, batch_meta: list, batch_ids: list):
        """Encode un lot de chunks et les insère dans ChromaDB."""
        if not batch_docs:
            return

        try:
            embeddings = self.encoder.encode(batch_docs, show_progress_bar=False).tolist()
            self.collection.upsert(
                documents=batch_docs,
                embeddings=embeddings,
                metadatas=batch_meta,
                ids=batch_ids,
            )
        except Exception as e:
            logger.error(f"Échec lors de l'insertion d'un lot dans ChromaDB : {e}")
            raise

    def get_markdown_files(self) -> list[Path]:
        """Génère la liste de tous les fichiers markdown locaux."""
        if not DATASET_DIR.exists():
            raise FileNotFoundError(f"Le dossier dataset introuvable: {DATASET_DIR}. \nAvez-vous cloné le dataset dans `backend/dataset_local` ?")
        
        logger.info(f"Recherche de fichiers .md dans {DATASET_DIR}...")
        files = list(DATASET_DIR.rglob("*.md"))
        
        # LIMITATION POUR TEST
        files = files[:1000]

        logger.info(f"Trouvé {len(files)} fichiers markdown.")
        return files

    def run(self):
        """Exécute l'ingestion depuis les fichiers locaux (streaming/générateur)."""
        logger.info("Début de l'ingestion du dataset local...")
        
        md_files = self.get_markdown_files()
        
        pending_files = [f for f in md_files if str(f.relative_to(DATASET_DIR)) not in self.processed_files]
        logger.info(f"Il reste {len(pending_files)} fichiers à traiter.")

        batch_docs, batch_meta, batch_ids = [], [], []
        total_chunks = 0
        
        try:
            for file_idx, filepath in enumerate(pending_files):
                relative_path = str(filepath.relative_to(DATASET_DIR))
                
                # Extraction des métadonnées basiques depuis le chemin
                # Format attendu : Rel-10/21_series/21101-a00.md
                parts = relative_path.split(os.sep)
                release = parts[0] if len(parts) > 0 else "Unknown"
                series = parts[1] if len(parts) > 1 else "Unknown"
                filename = parts[-1]

                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        text_content = f.read().strip()
                except Exception as e:
                    logger.error(f"Erreur de lecture du fichier {relative_path}: {e}")
                    continue

                if not text_content:
                    logger.debug(f"Fichier vide ignoré: {relative_path}")
                    self.processed_files.add(relative_path)
                    continue

                chunks = self.text_splitter.split_text(text_content)

                for chunk_idx, chunk in enumerate(chunks):
                    # Génération d'un ID unique et stable
                    doc_id = f"{filename}_chunk{chunk_idx}"
                    
                    meta = {
                        "source": "TSpec-LLM Local",
                        "release": release,
                        "category": series,
                        "file_path": relative_path,
                        "chunk_index": chunk_idx
                    }

                    batch_docs.append(chunk)
                    batch_meta.append(meta)
                    batch_ids.append(doc_id)

                    if len(batch_docs) >= settings.BATCH_SIZE:
                        for attempt in range(MAX_RETRIES):
                            try:
                                self._process_batch(batch_docs, batch_meta, batch_ids)
                                total_chunks += len(batch_docs)
                                break 
                            except Exception as net_e:
                                logger.warning(f"Erreur ChromaDB (tentative {attempt+1}/{MAX_RETRIES}): {net_e}")
                                time.sleep(1) 
                        else:
                            raise RuntimeError("Échec persistant du traitement du lot ChromaDB.")
                        
                        batch_docs, batch_meta, batch_ids = [], [], []
                
                # Le fichier entier a été parsé et ajouté aux buffers/Chroma
                self.processed_files.add(relative_path)

                # Sauvegarde du checkpoint tous les 20 fichiers pour ne pas plomber les IOs
                if file_idx > 0 and file_idx % 20 == 0:
                    self._save_checkpoint()
                    logger.info(f"Avancement : {file_idx}/{len(pending_files)} fichiers lus. Chunks insérés au total: {total_chunks}")

            # Flush final
            if batch_docs:
                self._process_batch(batch_docs, batch_meta, batch_ids)
                total_chunks += len(batch_docs)
                self._save_checkpoint()
                logger.info("Lot final flushé dans ChromaDB.")

            logger.info(f"🎉 Ingestion terminée avec succès ! (Total chunks: {total_chunks})")
            self.verify_ingestion()

        except KeyboardInterrupt:
            self._save_checkpoint()
            logger.warning("\nInterruption manuelle (Ctrl+C). L'état a été sauvegardé au dernier checkpoint.")
        except Exception as e:
            self._save_checkpoint()
            logger.error(f"Erreur critique lors de l'ingestion : {e}", exc_info=True)

    def verify_ingestion(self):
        logger.info("=== Lancement de la requête de vérification ===")
        try:
            query = "What is 5G NR physical layer specification?"
            query_embedding = self.encoder.encode([query]).tolist()
            
            results = self.collection.query(
                query_embeddings=query_embedding,
                n_results=1
            )
            
            if results and results["documents"] and len(results["documents"][0]) > 0:
                doc = results["documents"][0][0]
                logger.info(f"Succès. Extrait pertinent trouvé : {doc[:150]}...")
            else:
                logger.warning("La requête est passée mais a retourné un résultat vide.")
        except Exception as e:
            logger.error(f"Échec de la vérification : {e}")


if __name__ == "__main__":
    pipeline = IngestionPipelineLocal()
    pipeline.run()
