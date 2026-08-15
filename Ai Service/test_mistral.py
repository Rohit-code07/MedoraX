from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI

load_dotenv()

llm = ChatMistralAI(
    model="mistral-small-latest",
    temperature=0
)

response = llm.invoke("What is Spring Boot? Answer in one sentence.")

print(response.content)