import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import api from "../api";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { user, setUser } = useAuth();

  const submit = async () => {
    try {
      await api.post(
        "/auth/register",
        { email, password, confirmPassword },
        { withCredentials: true },
      );

      // Immediately fetch current user
      const meRes = await api.get("/auth/me", { withCredentials: true });
      setUser(meRes.data); // set in useAuth
      navigate("/dashboard");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(
        axiosError.response?.data?.message ||
          `Registration failed: For user ${user}`,
      );
      toast.error(
        axiosError.response?.data?.message ||
          `Registration failed: For user ${user}`,
      );
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "200px auto" }}>
      <h2>Create Account</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <br />
      <br />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />
      <input
        type="password"
        placeholder="Confirm Password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={submit} className="submit" style={{ marginTop: 30 }}>
        Register
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
