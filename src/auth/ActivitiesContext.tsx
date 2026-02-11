/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import api from "../api";
import { useAuth } from "./AuthContext";

export type Activity = {
  id: string;
  type: "DEBIT" | "CREDIT" | "USER";
  message: string;
  created_at: string;
  amount: number;
  balance_before: number;
  balance_after: number;
};

type ActivitiesContextType = {
  activities: Activity[];
  loading: boolean;
  refreshActivities: () => Promise<void>;
  removeActivity: (id: string) => Promise<void>;
};

const ActivitiesContext = createContext<ActivitiesContextType | null>(null);

export const ActivitiesProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [, setLoading] = useState(true);

  /* ================= FETCH ================= */
  const refreshActivities = async () => {
    try {
      const res = await api.get("/activities/me", {
        withCredentials: true,
      });
      setActivities(res.data);
    } catch (err) {
      toast.error(`Failed to set balance ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 🔥 WAIT FOR AUTH TO FINISH
    if (loading) return;

    // 🔥 ONLY FETCH IF USER EXISTS
    if (!user) return;
    refreshActivities();
  }, []);

  /* ================= DELETE (OPTIMISTIC) ================= */
  const removeActivity = async (id: string) => {
    const prev = activities;
    setActivities((a) => a.filter((x) => x.id !== id));

    try {
      await api.delete(`/activities/${id}`, {
        withCredentials: true,
      });
    } catch {
      setActivities(prev);
      toast.error("Failed to delete activity");
    }
  };

  return (
    <ActivitiesContext.Provider
      value={{ activities, loading, refreshActivities, removeActivity }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
};

/* ================= HOOK ================= */
export const useActivities = () => {
  const ctx = useContext(ActivitiesContext);
  if (!ctx)
    throw new Error("useActivities must be used inside ActivitiesProvider");
  return ctx;
};
