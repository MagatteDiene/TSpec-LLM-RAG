# TSpec-LLM RAG — 3GPP Telecom Q&A System

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)](https://langchain.com/)
[![Groq](https://img.shields.io/badge/Groq-f55036?style=for-the-badge)](https://groq.com/)

---

##  Live Demo
- **Frontend** : https://tspec-llm-rag.vercel.app
- **Backend API** : https://magattediene-tspec-llm-backend.hf.space
- **Health Check** : https://magattediene-tspec-llm-backend.hf.space/api/v1/health

[![HuggingFace](https://img.shields.io/badge/HuggingFace-Spaces-yellow?style=for-the-badge&logo=huggingface)](https://magattediene-tspec-llm-backend.hf.space)
[![Vercel](https://img.shields.io/badge/Vercel-deployed-black?style=for-the-badge&logo=vercel)](https://tspec-llm-rag.vercel.app)

### Description
Un système complet de **Génération Augmentée par la Recherche (RAG)** conçu pour répondre aux questions techniques sur les spécifications télécom 3GPP (3G/4G/5G). Le projet utilise le jeu de données spécialisé `TSpec-LLM` pour garantir des réponses précises et sourcées.

### Stack Technique
- **Backend** : Python + FastAPI + Uvicorn
- **Orchestration RAG** : LangChain (Pipeline LCEL)
- **Embeddings** : `sentence-transformers` (`all-MiniLM-L6-v2`)
- **Base de Données Vectorielle** : ChromaDB (Persistante)
- **LLM** : API Groq (`llama-3.1-8b-instant`)
- **Dataset** : HuggingFace `rasoul-nikbakht/TSpec-LLM`
- **Frontend** : React JS + Vite + Tailwind CSS

### Architecture (V2 MVC)

#### Backend
- `app/api/routes/chat.py` : Endpoint principal `POST /api/v1/chat/ask`
- `app/api/routes/health.py` : Vérification de l'état du serveur `GET /api/v1/health`
- `app/api/api_router.py` : Agrégation des routes
- `app/core/config.py` : Gestion des paramètres via Pydantic
- `app/schemas/chat_schema.py` : Modèles de données (Request/Response)
- `app/services/rag_service.py` : Logique métier (LangChain + Groq + ChromaDB)
- `app/main.py` : Point d'entrée de l'application FastAPI
- `scripts/ingest.py` : Pipeline ETL pour l'indexation des données

#### Frontend
- `src/api/chatApi.js` : Communication avec l'API
- `src/hooks/useChat.js` : Gestion de l'état du chat
- `src/components/layout/` : Structure de base (Header, MainLayout)
- `src/components/chat/ChatBubble.jsx` : Design Glassmorphism pour les messages
- `src/components/chat/SourceList.jsx` : Affichage des sources avec effet néon
- `src/components/chat/AIBrain.jsx` : Cerveau SVG animé interactif
- `src/components/chat/AnimatedBackground.jsx` : Arrière-plan "Digital Rain"

### Flux RAG
1. L'utilisateur pose une question via l'interface React.
2. Le frontend appelle l'API FastAPI.
3. Le backend vectorise la question avec `SentenceTransformer`.
4. ChromaDB retourne les 5 extraits (chunks) les plus pertinents.
5. LangChain construit le prompt final (Contexte + Historique + Question).
6. Llama 3.1 8B (via Groq) génère une réponse experte en français.
7. La réponse est renvoyée avec les sources au frontend pour affichage.

### Installation Locale

#### Prérequis
- Python 3.10+
- Node.js 18+
- Une clé API Groq

#### Configuration Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate # Windows
pip install -r requirements.txt
```

Créez un fichier `backend/.env` :
```env
GROQ_API_KEY=votre_cle
GROQ_MODEL=llama-3.1-8b-instant
CHROMA_DIR=./chroma_db
COLLECTION_NAME=tspec_llm
HF_TOKEN=votre_hf_token
FRONTEND_URL=http://localhost:5173
```

#### Ingestion des données (à faire une fois)
```bash
python scripts/ingest.py
```

#### Lancement
**Backend:** `uvicorn app.main:app --reload`
**Frontend:** `cd frontend && npm install && npm run dev`

### Déploiement

#### Backend — Hugging Face Spaces (Docker)
- **Plateforme** : [Hugging Face Spaces](https://huggingface.co/spaces)
- **Stratégie** : La base ChromaDB (1.2 Go) est stockée sur un Dataset HF privé. Au démarrage, `start.sh` télécharge automatiquement les données pour assurer la persistance sans alourdir l'image Docker.

#### Frontend — Vercel
- **Plateforme** : [Vercel](https://vercel.com)
- **Variable** : `VITE_API_URL` pointant vers l'URL du Space Hugging Face.

---

