import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // backend port fixed
  withCredentials: true,
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      console.warn("Session expired or unauthenticated");
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
