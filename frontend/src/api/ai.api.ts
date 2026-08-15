import api from "./axios";

export interface AiMedicineRequest {
  medicine_name: string;
  question: string;
}

export interface AiMedicineResponse {
  medicine_name: string;
  answer: string;
}

export interface AiPrescriptionRequest {
  prescription_text: string;
}

export interface AiPrescriptionResponse {
  analysis: string;
}

export interface AiChatRequest {
  message: string;
}

export interface AiChatResponse {
  response: string;
}

export const explainMedicineAi = (data: AiMedicineRequest) =>
  api.post<AiMedicineResponse>("/api/ai/explain", data);

export const analyzePrescriptionAi = (data: AiPrescriptionRequest) =>
  api.post<AiPrescriptionResponse>("/api/ai/prescription", data);

export const chatAi = (data: AiChatRequest) =>
  api.post<AiChatResponse>("/api/ai/chat", data);

export const getAiHealth = () =>
  api.get<{ status: string }>("/api/ai/health");
