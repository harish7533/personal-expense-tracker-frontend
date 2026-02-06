import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // backend port fixed
});

/* Attach JWT token automatically */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
