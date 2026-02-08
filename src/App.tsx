import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Bills from "./pages/Bills";
import UploadBills from "./pages/UploadBills";
import CreateBill from "./pages/CreateBill";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./auth/AuthRedirect";
import LandingPage from "./components/LandingPage";
import Settings from "./pages/Settings";
import Activity from "./pages/Activity";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--card-bg)",
            color: "var(--text)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
          },
        }}
      />
      <Routes>
        {/* 🌍 Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* 🔐 Auth */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* 🔒 Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadBills />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateBill />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bills"
          element={
            <ProtectedRoute>
              <Bills />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <Activity />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={
            <AuthRedirect>
              <LandingPage />
            </AuthRedirect>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
