from pydantic import BaseModel, Field


class MedicineRequest(BaseModel):
    medicine_name: str = Field(..., min_length=1)
    question: str = Field(..., min_length=1)


class MedicineResponse(BaseModel):
    medicine_name: str
    answer: str