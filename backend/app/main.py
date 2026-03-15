from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api_router import api_router
from app.api.routes.chat import get_rag_service

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="3GPP Telecom Q&A powered by RAG + Groq LLM",
)

# Cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    # Warm up the pipeline
    get_rag_service()
