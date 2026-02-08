/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { JSX } from "react";

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

  // ⏳ Wait for auth hydration
  if (loading) {
    return <p style={{ textAlign: "center", marginTop: 40 }}>Checking session…</p>;
  }

  // 🔐 Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Role-based guard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Authorized
  return children;
}

