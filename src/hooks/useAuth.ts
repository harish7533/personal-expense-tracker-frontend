import { useEffect, useState } from "react";
import api from "../api";
import { useBanner } from "./useBanner";

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
  const { show, clear } = useBanner();

  useEffect(() => {
    let alive = true;

    api
      .get("/auth/me", { withCredentials: true })
      .then((res) => {
        if (!alive) return;
        setUser(res.data);
        clear(); // Clear any existing banners on successful auth check
      })
      .catch((err) => {
        if (!alive) return;

        setUser(null);

        if (err.response?.status === 401) {
          show("session-expired")
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [show, clear]);

  return { user, loading };
}
