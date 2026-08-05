import api from "./axios";

export const checkMismatch = (formData: FormData) =>
  api.post("/api/mismatch/check", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const ocrOnly = (formData: FormData) =>
  api.post("/api/mismatch/ocr-only", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const identifyMedicine = (formData: FormData) =>
  api.post("/api/mismatch/identify-medicine", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
