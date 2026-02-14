/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
// import { useBanner } from "../hooks/useBanner";

export type Role = "ADMIN" | "USER";
export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  username: string;
  balance: number | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authorizedToken, setAuthorizedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // const { show } = useBanner();

  // 🔁 Hydrate once on app load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        setAuthorizedToken(token);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false); // 🔥 ALWAYS ends loading
    }
  }, []);

  const login = (user: AuthUser, token: string) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);                          // 🔥 instantly updates UI
    setAuthorizedToken(token);    // 🔥 instantly updates UI
    setLoading(false);                      // 🔥 prevents stuck loading
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setAuthorizedToken(null);
    // show("logged-out");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, token: authorizedToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
