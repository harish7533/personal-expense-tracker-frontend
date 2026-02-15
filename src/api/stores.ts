/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../api";

export const getStores = async () => {
  const res = await api.get("/stores", { withCredentials: true } );
  return res.data.map((s: any) => s.name);
};

export const addStore = async (name: string) => {
  const res = await api.post("/stores/create", { name }, { withCredentials: true } );
  return res.data;
};
