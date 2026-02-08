/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type Role = "ADMIN" | "USER";

interface ProtectedRouteProps {
  children: any;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // 🔐 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) return <p>Checking session...</p>;

  // 🚫 Role not allowed (only if roles are specified)
  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Authorized
  return children;
}
