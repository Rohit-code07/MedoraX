import api from "./axios";

export const login = (data: any) => api.post("/auth/login", data);
export const signup = (data: any) => api.post("/auth/signup", data);
export const getCurrentUser = () => api.get("/api/auth/me");
export const logoutUser = () => api.post("/api/auth/logout");
