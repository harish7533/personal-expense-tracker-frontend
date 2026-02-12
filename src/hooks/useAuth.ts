export { useAuth } from "../context/AuthContext";

// import { useEffect, useState } from "react";

// export type Role = "ADMIN" | "USER";

// export interface AuthUser {
//   id: string;
//   email: string;
//   role: Role;
//   username: string;
// }

// export function useAuth() {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [loading, setLoading] = useState(true);

//   // 🔁 Hydrate auth from localStorage once
//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem("user");
//       const token = localStorage.getItem("token");

//       if (storedUser && token) {
//         setUser(JSON.parse(storedUser));
//       } else {
//         setUser(null);
//       }
//     } finally {
//       // ✅ Always end loading
//       setLoading(false);
//     }
//   }, []);

//   const login = (user: AuthUser, token: string) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user));
//     setUser(user);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return {
//     user,
//     loading,
//     login,
//     logout,
//     isAuthenticated: !!user,
//   };
// }

// /* eslint-disable react-hooks/set-state-in-effect */
// import { useEffect, useState } from "react";
// import api from "../api";

// export type Role = "ADMIN" | "USER";
// export interface AuthUser {
//   id: string;
//   email: string;
//   role: Role;
//   username: string;
// }

// export function useAuth() {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let alive = true;

//     // Only fetch if user has a cookie/session
//     const tokenExists = document.cookie.includes("sb-access-token");
//     if (!tokenExists) {
//       setUser(null);
//       setLoading(false);
//       return;
//     }

//     api
//       .get("/auth/me", { withCredentials: true })
//       .then((res) => {
//         if (!alive) return;
//         setUser(res.data);
//       })
//       .catch(() => {
//         if (alive) setUser(null);
//       })
//       .finally(() => {
//         if (alive) setLoading(false);
//       });

//     return () => {
//       alive = false;
//     };
//   }, []);

//   return { user, loading, setUser };
// }
