import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { JSX } from "react/jsx-dev-runtime";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ⏳ Wait until auth is resolved
  if (loading) return null; // or skeleton

  // 🔐 Not logged in
  if (!user) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
}





// import { Navigate } from "react-router-dom";
// import { useAuth, type Role } from "../hooks/useAuth";
// import type { JSX } from "react";
// import AuthSkeleton from "./skeletons/AuthSkeleton";

// interface ProtectedRouteProps {
//   children: JSX.Element;
//   allowedRoles?: Role[];
// }

// export default function ProtectedRoute({
//   children,
//   allowedRoles,
// }: ProtectedRouteProps) {
//   const { user, loading } = useAuth();
//   // const location = useLocation();

//   // ⏳ Still checking auth (important)
//   if (loading) return <AuthSkeleton />;

//   // 🔐 Not logged in → go to login
//   // if (!user) {
//   //   return <Navigate to="/login" replace state={{ from: location.pathname }} />;
//   // }

//   // 🚫 Role not allowed
//   if (allowedRoles && !allowedRoles.includes(user?.role as Role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // ✅ All good
//   return children;
// }
