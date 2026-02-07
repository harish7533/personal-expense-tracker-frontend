import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    try {
      const res = await api.post(
        "/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } },
      );

      const { token, role, userId } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      // Role-based navigation
      if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err: unknown) {
      console.error("LOGIN ERROR:", err);

      const axiosError = err as AxiosError<{
        message?: string;
        error?: string;
      }>;

      setError(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          axiosError.message ||
          "Login failed. Please check your credentials.",
      );
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "200px auto" }}>
      <h2>🔐 Login</h2>

      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />

      <button onClick={handleLogin} className="submit">
        Login
      </button>

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </div>
  );
}
