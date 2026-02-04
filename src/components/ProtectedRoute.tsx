/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}
