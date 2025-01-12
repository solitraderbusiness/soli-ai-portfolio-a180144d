import NavBar from "@/components/shared/NavBar";
import AnalystDashboard from "@/components/admin/AnalystDashboard";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">Analyst Dashboard</h1>
        <AnalystDashboard />
      </div>
    </div>
  );
};

export default Admin;