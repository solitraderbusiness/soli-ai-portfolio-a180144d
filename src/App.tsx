import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import NavBar from "@/components/shared/NavBar";
import AnalystDashboard from "@/components/admin/AnalystDashboard";
import DailyAnalyses from "@/pages/DailyAnalyses";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<NavBar />} />
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
