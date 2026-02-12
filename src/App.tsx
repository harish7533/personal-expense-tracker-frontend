import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
import Bills from "./pages/Bills";
import UploadBills from "./pages/UploadBills";
import CreateBill from "./pages/CreateBill";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./components/LandingPage";
import Settings from "./pages/Settings";
import Activity from "./pages/Activity";
import { Toaster } from "react-hot-toast";
import Banner from "./components/Banner";
import SetBalance from "./pages/SetBalance";
import DashboardLayout from "./components/dashboard/DashBoardLayout";

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

      <Banner />

      <Routes>
        {/* 🌍 Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* 🔐 Auth */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/set-balance" element={<SetBalance />} />

        {/* 🔒 Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {/* <Dashboard /> */}
              <DashboardLayout/>
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
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
