import LoginForm from "@/components/auth/LoginForm";
import NavBar from "@/components/shared/NavBar";

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto py-12 flex justify-center items-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;