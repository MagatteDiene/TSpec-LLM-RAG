from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    """Simple health check."""
    return {"status": "ok"}
