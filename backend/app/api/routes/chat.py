from fastapi import APIRouter, HTTPException, Depends
from app.schemas.chat_schema import AskRequest, AskResponse
from app.services.rag_service import RAGService

router = APIRouter()

# Global pipeline instance mapped to lifespan or lazy loading
# In a real heavy app we use state via request.app.state
_rag_service_instance = None

def get_rag_service() -> RAGService:
    global _rag_service_instance
    if _rag_service_instance is None:
        _rag_service_instance = RAGService()
    return _rag_service_instance

@router.post("/ask", response_model=AskResponse)
async def ask_question(
    request: AskRequest,
    rag_service: RAGService = Depends(get_rag_service)
):
    """
    Accept a natural-language question and return a 3GPP-grounded answer
    together with the source chunks used to generate it.
    """
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question must not be empty.")

    try:
        result = rag_service.ask(request.question.strip())
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
