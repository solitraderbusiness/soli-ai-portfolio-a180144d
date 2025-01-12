import RegisterForm from "@/components/auth/RegisterForm";
import NavBar from "@/components/shared/NavBar";

const Register = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto py-12 flex justify-center items-center">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;