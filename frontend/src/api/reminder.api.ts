import api from "./axios";

export const getReminders = () => api.get("/remainder/all");
export const createReminder = (body: any) => api.post("/remainder/create", body);
export const updateReminder = (id: number | string, st: string) => api.put(`/remainder/update-status/${id}?st=${st}`);
