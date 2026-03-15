from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # API configuration
    PROJECT_NAME: str = "TSpec-LLM RAG API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    FRONTEND_URL: str = "http://localhost:5173"

    # LLM configuration
    GROQ_API_KEY: str
    GROQ_MODEL: str = "llama-3.1-8b-instant"
    HF_TOKEN: str = ""

    # Vector DB configuration
    CHROMA_DIR: str = "/data/chroma_db"
    COLLECTION_NAME: str = "tspec_llm"

    # Embeddings configuration
    EMBED_MODEL_NAME: str = "all-MiniLM-L6-v2"
    CHUNK_SIZE: int = 512
    BATCH_SIZE: int = 64
    TOP_K: int = 5

    # Configure Pydantic to read from the .env file
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        extra="ignore"
    )

settings = Settings()
