import api from "../api";

export const getCategories = async (): Promise<string[]> => {
  const res = await api.get("/categories");
  return res.data;
};

export const addCategory = async (name: string) => {
  await api.post("/categories", { name });
};