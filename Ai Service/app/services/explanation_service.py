from app.chains.explanation_chain import medicine_chain
from app.models.explanation_models import MedicineRequest, MedicineResponse


def explain_medicine(request: MedicineRequest) -> MedicineResponse:

    answer = medicine_chain.invoke(
        {
            "medicine_name": request.medicine_name,
            "question": request.question,
        }
    )

    return MedicineResponse(
        medicine_name=request.medicine_name,
        answer=answer,
    )