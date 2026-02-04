import { type JSX } from "react";
import { Navigate } from "react-router-dom";

export default function AuthRedirect({
  children,
}: {
  children: JSX.Element;
}) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
