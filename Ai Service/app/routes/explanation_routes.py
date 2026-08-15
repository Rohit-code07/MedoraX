from fastapi import APIRouter

from app.models.explanation_models import (
    MedicineRequest,
    MedicineResponse,
)

from app.services.explanation_service import explain_medicine


router = APIRouter(
    prefix="/api/medicine",
    tags=["Medicine"]
)


@router.post(
    "/explain",
    response_model=MedicineResponse
)
def explain_medicine_endpoint(
    request: MedicineRequest,
):

    return explain_medicine(request)