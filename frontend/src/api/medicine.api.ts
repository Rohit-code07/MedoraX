import api from "./axios";

export const getMedicines = () => api.get("/api/medicines");
export const getMedicine = (id: number | string) => api.get(`/api/medicines/${id}`);
export const addMedicine = (body: any) => api.post("/api/medicines", body);
export const updateMedicine = (id: number | string, body: any) => api.put(`/api/medicines/${id}`, body);
export const deleteMedicine = (id: number | string) => api.delete(`/api/medicines/${id}`);
export const explainMedicine = (body: any) => api.post("/api/medicines/explain", body);
export const processPrescription = (formData: FormData) => api.post("/api/medicines/process-prescription", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const markMedicineTaken = (id: number | string) => api.put(`/api/medicines/${id}/taken`);
export const markMedicineMissed = (id: number | string) => api.put(`/api/medicines/${id}/missed`);
