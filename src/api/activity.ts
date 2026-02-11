import api from "../api";

export const fetchMyActivities = () =>
  api.get("/activities/me", { withCredentials: true });

export const deleteActivity = (id: string) =>
  api.delete(`/activities/${id}`, { withCredentials: true });

export const markAllAsRead = () =>
  api.patch("/activities/mark-read", {}, { withCredentials: true });

