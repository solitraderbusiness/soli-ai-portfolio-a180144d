import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import NavBar from "@/components/shared/NavBar";
import AnalystDashboard from "@/components/admin/AnalystDashboard";
import DailyAnalyses from "@/pages/DailyAnalyses";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import RiskAssessment from "@/components/assessment/RiskAssessment";
import Index from "@/pages/Index";

function App() {
  return (
    <Router>
      <Toaster />
      <NavBar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes for all authenticated users */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/risk-assessment"
          element={
            <ProtectedRoute>
              <div className="container mx-auto py-12 flex justify-center">
                <RiskAssessment />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Protected routes for analysts only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roleRequired="analyst">
              <AnalystDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/daily-analyses/:date"
          element={
            <ProtectedRoute roleRequired="analyst">
              <DailyAnalyses />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;