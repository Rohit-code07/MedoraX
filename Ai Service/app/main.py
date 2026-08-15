from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI
from langchain_core.prompts import ChatPromptTemplate

from app.prompts.explanation_prompts import MEDICINE_EXPLANATION_PROMPT
from app.routes.explanation_routes import router as explanation_router
from app.routes.prescription_routes import router as prescription_router

load_dotenv()

app = FastAPI(
    title="MedoraX AI Service",
    description="AI service for MedoraX medicine information and prescription analysis",
    version="1.0.0"
)

app.include_router(explanation_router)
app.include_router(prescription_router)

llm = ChatMistralAI(
    model="mistral-small-latest",
    temperature=0
)


class ChatRequest(BaseModel):
    message: str


template = ChatPromptTemplate([
    ("system", MEDICINE_EXPLANATION_PROMPT),
    ("human", "{question}")
])

medicine_chain = template | llm


@app.get("/")
def root():
    return {"message": "MedoraX AI Service is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/chat")
def chat(request: ChatRequest):
    response = medicine_chain.invoke({
        "question": request.message,
        "medicine_name": "Not specified"
    })

    return {
        "response": response.content
    }