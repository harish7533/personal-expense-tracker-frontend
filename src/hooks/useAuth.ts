/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useAuth.ts
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
  const isRole = (value: any): value is Role =>
  value === "ADMIN" || value === "USER";

  useEffect(() => {
    let alive = true;
    api
      .get("/auth/me", { withCredentials: true }) // 🍪 cookie automatically sent
      .then((res) => {
        if (alive) {
          const data = res.data;

          if (!isRole(data.role)) {
            throw new Error("Invalid role from server");
          }

          setUser(res.data);
        }
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

  return { user, loading };
}
