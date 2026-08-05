import api from "./axios";

export const getProfile = (userId: number | string) => api.get(`/api/profile?userId=${userId}`);
export const createProfile = (userId: number | string, body: any) => api.post(`/api/profile?userId=${userId}`, body);
export const updateProfile = (userId: number | string, body: any) => api.put(`/api/profile?userId=${userId}`, body);
