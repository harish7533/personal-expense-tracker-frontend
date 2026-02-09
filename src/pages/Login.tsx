/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import api from "../api";
import type { AxiosError } from "axios";
import { toast } from "react-hot-toast/headless";
// import { useBanner } from "../hooks/useBanner";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { user, login } = useAuth();
  const navigate = useNavigate();
  // const { clear } = useBanner();

  const handleLogin = async () => {
    setError("");

    try {
      const res = await api.post(
        "/auth/login",
        { email, password },
        { withCredentials: true },
      );

      // clear(); // ✅ Reset session expired state on successful login
      toast.success(`Welcome back 👋 ${user}`);
      login(res.data.user, res.data.token);
      navigate("/dashboard", { replace: true});
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);

      toast.error(err.response?.data?.message || "Login failed");

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
