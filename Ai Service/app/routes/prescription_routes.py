from fastapi import APIRouter

from app.models.prescription_models import (
    PrescriptionRequest,
    PrescriptionResponse,
)

from app.services.prescription_service import analyze_prescription


router = APIRouter(
    prefix="/api/prescription",
    tags=["Prescription"]
)


@router.post(
    "/analyze",
    response_model=PrescriptionResponse
)
def analyze_prescription_endpoint(
    request: PrescriptionRequest,
):

    return analyze_prescription(request)