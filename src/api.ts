import axios from "axios";
import { showBanner } from "./components/BannerManager";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // backend port fixed
  withCredentials: true,
});

let sessionExpiredShown = false;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && !sessionExpiredShown) {
      // Only show banner if user was logged in
      const tokenExists = document.cookie.includes("sb-access-token");
      if (tokenExists) {
        sessionExpiredShown = true;
        showBanner({
          message: "⚠️ Session expired. Please log in again.",
          type: "error",
          autoDismiss: false,
        });
      }
    }
    return Promise.reject(err);
  }
);

/* OCR Upload */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await api.post("/ocr", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.text;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Image upload failed");
  }
}

export default api;
