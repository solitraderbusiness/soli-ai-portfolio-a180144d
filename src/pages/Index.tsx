import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-24">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-primary">
            Smart Portfolio Management
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get personalized investment recommendations based on your risk profile
            and market analysis from expert analysts.
          </p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-block bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;