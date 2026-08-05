import api from "./axios";

export const getAnalytics = (id: number | string) => api.get(`/api/analytics/${id}`);
export const getStreak = (id: number | string) => api.get(`/api/analytics/${id}/streak`);
export const getWeeklyRate = (id: number | string) => api.get(`/api/analytics/${id}/weekly-rate`);
export const getBestMedicine = (id: number | string) => api.get(`/api/analytics/${id}/best-medicine`);
export const getMostMissed = (id: number | string) => api.get(`/api/analytics/${id}/most-missed`);
export const getWeeklyChart = (id: number | string) => api.get(`/api/analytics/${id}/weekly-chart`);
export const getMedicineRate = (id: number | string) => api.get(`/api/analytics/${id}/per-medicine-rate`);
export const getHeatmap = () => api.get("/api/analytics/heatmap");
