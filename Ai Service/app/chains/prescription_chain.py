import os

from dotenv import load_dotenv  # pip install python-dotenv
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI

from app.prompts.prescription_prompts import PRESCRIPTION_ANALYSIS_PROMPT

load_dotenv()

if not os.getenv("MISTRAL_API_KEY"):
    raise RuntimeError("MISTRAL_API_KEY is not configured")


prompt = ChatPromptTemplate.from_template(
    PRESCRIPTION_ANALYSIS_PROMPT
)

llm = ChatMistralAI(
    model="mistral-small-latest",
    temperature=0.1,
    max_retries=2,
)

prescription_chain = prompt | llm | StrOutputParser()