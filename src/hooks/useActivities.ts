/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import api from "../api"; // your axios instance
import { useAuth } from "./useAuth";

type Activity = {
  id: string;
  user_id: string;
  type: string;
  message: string;
  created_at: string;
};

export default function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { user } = useAuth(); // dynamic auth instead of localStorage

  useEffect(() => {    
    const fetchActivities = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/activities/user/${user?.id}`);

        setActivities(res.data || []);
      } catch (err: any) {
        console.error("FETCH ACTIVITIES ERROR:", err);
        setError(`Failed to load activities: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();

    // Optional: poll every 30 seconds for new activities
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, [user?.id]); // refetch if user changes

  const removeActivity = (id: string) =>
    setActivities((prev) => prev.filter((a) => a.id !== id));

  return { activities, loading, error, removeActivity };
}
