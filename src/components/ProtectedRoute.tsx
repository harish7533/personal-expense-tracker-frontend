import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";
import AuthSkeleton from "./skeletons/AuthSkeleton";

type Role = "ADMIN" | "USER";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // ⏳ Still checking auth (important)
  if (loading) {
    return <AuthSkeleton />; 
  }

  // 🔐 Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role as Role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ All good
  return children;
}
