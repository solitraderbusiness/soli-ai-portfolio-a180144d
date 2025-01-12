import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-primary py-4 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          PortfolioManager
        </Link>
        <div className="space-x-4">
          <Link to="/login" className="text-white hover:text-gray-200">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-secondary px-4 py-2 rounded-lg text-white hover:bg-secondary/90"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;