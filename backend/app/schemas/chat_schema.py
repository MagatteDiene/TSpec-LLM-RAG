from pydantic import BaseModel
from typing import List

class AskRequest(BaseModel):
    question: str

class SourceItem(BaseModel):
    content: str
    metadata: dict

class AskResponse(BaseModel):
    answer: str
    sources: List[SourceItem]
