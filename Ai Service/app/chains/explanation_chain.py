import os

from dotenv import load_dotenv
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI

from app.prompts.explanation_prompts import MEDICINE_EXPLANATION_PROMPT

load_dotenv()

if not os.getenv("MISTRAL_API_KEY"):
    raise RuntimeError("MISTRAL_API_KEY is not configured")


prompt = ChatPromptTemplate.from_template(
    MEDICINE_EXPLANATION_PROMPT
)

llm = ChatMistralAI(
    model="mistral-small-latest",
    temperature=0.2,
    max_retries=2,
)

medicine_chain = prompt | llm | StrOutputParser()