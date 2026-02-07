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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌍 Public Landing Page */}
        <Route
          path="/"
          element={
            <AuthRedirect>
              <LandingPage />
            </AuthRedirect>
          }
        />

        {/* 🔐 Auth */}
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          }
        />

        <Route
          path="/register"
          element={
            <AuthRedirect>
              <Register />
            </AuthRedirect>
          }
        />

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
