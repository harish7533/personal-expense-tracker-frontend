import api from "../api";

export const getCategories = async (): Promise<string[]> => {
  const res = await api.get("/categories", { withCredentials: true } );
  return res.data;
};

export const addCategory = async (name: string) => {
  await api.post("/categories/create", { name }, { withCredentials: true } );
};