import chromadb
from sentence_transformers import SentenceTransformer
from langchain_groq import ChatGroq

from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

from app.core.config import settings
from app.schemas.chat_schema import AskResponse


PROMPT_TEMPLATE = PromptTemplate(
    input_variables=["context", "question"],
    template="""
Tu es un assistant expert en télécommunications 3GPP.

Règles importantes :

1. Tu réponds toujours en FRANÇAIS.
2. Tu es conversationnel et naturel comme un humain.
3. Ne répète pas des salutations si la conversation est déjà commencée.
4. STRUCTURE TA RÉPONSE : Utilise le format Markdown avec soin. Aère toujours tes textes avec des paragraphes séparés par des doubles sauts de ligne. Utilise obligatoirement du texte en gras pour les termes clés et utilise des listes à puces ou numérotées quand tu expliques plusieurs points ou caractéristiques.
5. Si la question est technique, réponds uniquement avec le contexte 3GPP fourni.
6. Si l'information n'est pas dans le contexte, réponds EXACTEMENT :

"Je n'ai pas trouvé suffisamment d'informations dans les spécifications 3GPP pour répondre à cette question."

--- Contexte 3GPP ---
{context}
--- Fin du contexte ---

Question utilisateur :
{question}

Réponse :
"""
)


class RAGService:

    def __init__(self):

        self._embedding_model = SentenceTransformer(settings.EMBED_MODEL_NAME)

        self._chroma_client = chromadb.PersistentClient(path=settings.CHROMA_DIR)

        self._collection = self._chroma_client.get_collection(
            name=settings.COLLECTION_NAME
        )

        self._llm = ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model_name=settings.GROQ_MODEL,
            temperature=0.3,
        )

        self._chain = (
            RunnablePassthrough()
            | (lambda x: {"context": x["context"], "question": x["question"]})
            | PROMPT_TEMPLATE
            | self._llm
            | StrOutputParser()
        )

        # mémoire conversationnelle simple
        self.chat_history = []

        # mots simples de conversation
        self.smalltalk = [
            "salut",
            "bonjour",
            "hello",
            "ça va",
            "merci",
            "merci beaucoup",
            "qui es tu",
            "tu es qui",
        ]


    def retrieve(self, question: str) -> list[Document]:
        """Retrieve top chunks from vector DB."""

        query_embedding = self._embedding_model.encode([question]).tolist()

        results = self._collection.query(
            query_embeddings=query_embedding,
            n_results=settings.TOP_K,
            include=["documents", "metadatas"],
        )

        docs = []

        for doc_text, meta in zip(results["documents"][0], results["metadatas"][0]):
            docs.append(Document(page_content=doc_text, metadata=meta))

        return docs


    def build_history(self):

        """Convert history to text"""

        history_text = ""

        for msg in self.chat_history[-6:]:
            history_text += msg + "\n"

        return history_text


    def ask(self, question: str) -> AskResponse:

        question_lower = question.lower().strip()

        # gestion small talk (pas de RAG)
        if question_lower in self.smalltalk:

            response = self._llm.invoke(question).content

            self.chat_history.append(f"User: {question}")
            self.chat_history.append(f"Assistant: {response}")

            return AskResponse(answer=response, sources=[])

        # récupération RAG
        retrieved_docs = self.retrieve(question)

        context = "\n\n".join([d.page_content for d in retrieved_docs])

        history_text = self.build_history()

        # Construction du prompt final (incluant la question et l'historique)
        if history_text.strip():
            full_question = f"[HISTORIQUE DES 3 DERNIERS ECHANGES POUR CONTEXTE (NE PAS CONFONDRE AVEC LE CONTEXTE 3GPP CI-DESSUS)]\n{history_text.strip()}\n\n[NOUVELLE QUESTION UTILSATEUR]\n{question}"
        else:
            full_question = question

        answer = self._chain.invoke(
            {
                "context": context,
                "question": full_question,
            }
        )

        # sauvegarde mémoire
        self.chat_history.append(f"User: {question}")
        self.chat_history.append(f"Assistant: {answer}")

        # vérifier si le modèle a trouvé une réponse
        if "Je n'ai pas trouvé suffisamment d'informations dans les spécifications 3GPP pour répondre à cette question." in answer:

            return AskResponse(
                answer=answer,
                sources=[]
            )

        sources = [
            {
                "content": doc.page_content,
                "metadata": doc.metadata,
            }
            for doc in retrieved_docs
        ]

        return AskResponse(
            answer=answer,
            sources=sources
        )