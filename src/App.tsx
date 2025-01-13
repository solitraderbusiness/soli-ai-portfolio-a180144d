import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import NavBar from "@/components/shared/NavBar";
import AnalystDashboard from "@/components/admin/AnalystDashboard";
import DailyAnalyses from "@/pages/DailyAnalyses";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<NavBar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AnalystDashboard />} />
        <Route 
          path="/daily-analyses/:date" 
          element={
            <ProtectedRoute>
              <DailyAnalyses />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;