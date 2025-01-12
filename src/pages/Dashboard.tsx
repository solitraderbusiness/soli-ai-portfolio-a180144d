import NavBar from "@/components/shared/NavBar";
import PortfolioDashboard from "@/components/dashboard/PortfolioDashboard";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">Your Portfolio</h1>
        <PortfolioDashboard />
      </div>
    </div>
  );
};

export default Dashboard;