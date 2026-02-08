// hooks/useAuth.ts
import { useEffect, useState } from "react";
import api from "../api";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  username: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me") // 🍪 cookie automatically sent
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
