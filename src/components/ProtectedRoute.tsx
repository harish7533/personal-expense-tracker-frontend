/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate } from "react-router-dom";

type Role = "ADMIN" | "USER";

interface ProtectedRouteProps {
  children: any;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") as Role | null;

  // 🔐 Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Role not allowed (only if roles are specified)
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Authorized
  return children;
}
