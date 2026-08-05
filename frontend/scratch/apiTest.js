// Simple test script to verify API integration
import { login, signup } from "../src/api/auth.api.js";
import { getMedicines } from "../src/api/medicine.api.js";

(async () => {
  try {
    const res = await login({ email: "test@example.com", password: "wrong" });
    console.log("Login response:", res.status, res.data);
  } catch (e) {
    console.error("Login error:", e.message);
  }

  try {
    const meds = await getMedicines();
    console.log("Medicines fetched, count:", meds.data?.length ?? 0);
  } catch (e) {
    console.error("Medicines error:", e.message);
  }
})();
