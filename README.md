# TSpec-LLM RAG — 3GPP Telecom Q&A System

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)](https://langchain.com/)
[![Groq](https://img.shields.io/badge/Groq-f55036?style=for-the-badge)](https://groq.com/)

---

## Version Française

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

## English Version

### Description
A comprehensive **Retrieval-Augmented Generation (RAG)** system designed to answer technical questions about 3GPP telecom specifications (3G/4G/5G). The project leverages the `TSpec-LLM` dataset to provide accurate and sourced answers.

### Tech Stack
- **Backend**: Python + FastAPI + Uvicorn
- **RAG Orchestration**: LangChain (LCEL Pipeline)
- **Embeddings**: `sentence-transformers` (`all-MiniLM-L6-v2`)
- **Vector Database**: ChromaDB (Persistent)
- **LLM**: Groq API (`llama-3.1-8b-instant`)
- **Dataset**: HuggingFace `rasoul-nikbakht/TSpec-LLM`
- **Frontend**: React JS + Vite + Tailwind CSS

### Architecture (V2 MVC)

#### Backend
- `app/api/routes/chat.py`: Main endpoint `POST /api/v1/chat/ask`
- `app/api/routes/health.py`: Server health check `GET /api/v1/health`
- `app/api/api_router.py`: Route aggregation
- `app/core/config.py`: Pydantic settings management
- `app/schemas/chat_schema.py`: Data models (Request/Response)
- `app/services/rag_service.py`: Business logic (LangChain + Groq + ChromaDB)
- `app/main.py`: FastAPI entry point
- `scripts/ingest.py`: ETL pipeline for data indexing

#### Frontend
- `src/api/chatApi.js`: API communication
- `src/hooks/useChat.js`: State management
- `src/components/chat/ChatBubble.jsx`: Glassmorphism message design
- `src/components/chat/SourceList.jsx`: Sourced extracts with neon effect
- `src/components/chat/AIBrain.jsx`: Animated interactive SVG brain
- `src/components/chat/AnimatedBackground.jsx`: "Digital Rain" background

### RAG Flow
1. User submits a question through the React UI.
2. React calls the FastAPI backend.
3. Question is encoded into a vector using `SentenceTransformer`.
4. ChromaDB retrieves the Top 5 relevant chunks.
5. LangChain assembles the prompt (Context + History + Question).
6. Llama 3.1 8B (Groq) generates a technical response.
7. Final answer + sources are returned to the frontend.

### Local Installation

#### Setup
Follow the same steps as the French version to install dependencies and configure your `.env` file. Ensure `scripts/ingest.py` is executed to build your local vector index.

### Deployment
The backend is deployed on **Hugging Face Spaces** using a Docker environment that dynamically pulls the ChromaDB index from a Hugging Face Dataset at runtime via `start.sh`. The frontend is hosted on **Vercel`.

### Example Questions
- "What is the difference between 4G LTE and 5G NR?"
- "Explain the HARQ mechanism in LTE"
- "What is beamforming in 5G?"
- "How does handover work in LTE networks?"
- "What is the Service-Based Architecture (SBA) in 5G?"


https://magattediene-tspec-llm-backend.hf.space
https://tspec-llm-rag.vercel.app