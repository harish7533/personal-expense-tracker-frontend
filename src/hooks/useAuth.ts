/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* hooks/useAuth.ts */
import { useEffect, useState } from "react";
import api from "../api";

type Role = "ADMIN" | "USER";
export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  username: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<number | null>(null);

  const isRole = (value: any): value is Role => value === "ADMIN" || value === "USER";

  useEffect(() => {
    let alive = true;

    // Only fetch if user has a cookie/session
    const tokenExists = document.cookie.includes("sb-access-token");
    if (!tokenExists) {
      setUser(null);
      setLoading(false);
      return;
    }

    api
      .get("/auth/me", { withCredentials: true })
      .then((res) => {
        if (!alive) return;
        const data = res.data;
        if (!isRole(data.role)) throw new Error("Invalid role from server");
        setUser(data);
        setLastChecked(Date.now());
      })
      .catch(() => {
        if (alive) setUser(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return { user, loading, lastChecked, setUser };
}
