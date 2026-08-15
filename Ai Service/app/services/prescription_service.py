from app.chains.prescription_chain import prescription_chain
from app.models.prescription_models import PrescriptionRequest, PrescriptionResponse


def analyze_prescription(request: PrescriptionRequest) -> PrescriptionResponse:

    analysis = prescription_chain.invoke(
        {
            "prescription_text": request.prescription_text,
        }
    )

    return PrescriptionResponse(
        analysis=analysis,
    )