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
      <div className="min-h-screen bg-gray-50 pt-16">
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
                <div className="container mx-auto px-4 py-12">
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
                <div className="container mx-auto py-12">
                  <AnalystDashboard />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/daily-analyses/:date"
            element={
              <ProtectedRoute roleRequired="analyst">
                <div className="container mx-auto py-12">
                  <DailyAnalyses />
                </div>
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;