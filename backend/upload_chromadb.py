import os
from huggingface_hub import HfApi, login

def upload_chroma():
    # 1. Login
    print("--- Connexion à Hugging Face ---")
    token = input("Entrez votre jeton (token) Hugging Face (Write access): ").strip()
    if not token:
        print("Erreur: Le jeton est requis.")
        return
    
    try:
        login(token=token)
    except Exception as e:
        print(f"Erreur lors de la connexion: {e}")
        return

    # 2. Configuration
    repo_id = "MagatteDiene/tspec-llm-chromadb"
    folder_path = "./chroma_db"
    
    if not os.path.exists(folder_path):
        print(f"Erreur: Le dossier {folder_path} n'existe pas.")
        return

    # 3. Upload
    api = HfApi()
    print(f"\n--- Déchargement du dossier {folder_path} vers {repo_id} ---")
    
    try:
        api.upload_folder(
            folder_path=folder_path,
            repo_id=repo_id,
            repo_type="dataset",
            commit_message="Mise à jour de la base vectorielle ChromaDB",
        )
        print("\nBravo ! L'upload est terminé avec succès.")
    except Exception as e:
        print(f"\nUne erreur est survenue lors de l'upload: {e}")

if __name__ == "__main__":
    upload_chroma()
