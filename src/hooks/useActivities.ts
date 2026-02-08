/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import api from "../api"; // your axios instance

export default function useActivities() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchActivities = async () => {
      if (!userId || !token) {
        setActivities([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await api.get(`/activities/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setActivities(res.data || []);
      } catch (err: any) {
        console.error("FETCH ACTIVITIES ERROR:", err);
        setError("Failed to load activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();

    // Optional: poll every 30 seconds for new activities
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, [userId, token]);

   const removeActivity = (id: string) =>
    setActivities((prev) => prev.filter((a) => a.id !== id));

  return { activities, loading, error, removeActivity };
}
