// hooks/useAuth.ts
import { useEffect, useState } from "react";
import api from "../api";

export interface AuthUser {
  id: string;
  username: string;
  role: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
   const [token] = useState<string | null>(
    localStorage.getItem("token")
  );

  useEffect(() => {
    api
       .get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [token]);

  return { user, loading, token };
}
