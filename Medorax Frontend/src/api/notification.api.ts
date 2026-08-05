import api from "./axios";

export const saveFcmToken = (body: any) => api.post("/api/user/fcm-token", body);
