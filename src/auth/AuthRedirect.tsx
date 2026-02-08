import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";

export default function AuthRedirect({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, loading } = useAuth();

  // ⏳ Wait for session check
  if (loading) return null;

  // 🔁 Already logged in → dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
