from pydantic import BaseModel, Field


class PrescriptionRequest(BaseModel):
    prescription_text: str = Field(..., min_length=1)


class PrescriptionResponse(BaseModel):
    analysis: str