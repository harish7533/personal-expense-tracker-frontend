import { useEffect, useState } from "react";
import api from "../api";

export interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
}

export default function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to load notifications "+err);
      }
    };

    fetchNotifications();
  }, [userId]);

  return notifications;
}
