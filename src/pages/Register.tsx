import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/shared/NavBar";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        navigate("/assessment");
      }
      if (event === "SIGNED_UP") {
        // This ensures we catch successful registrations
        console.log("User signed up successfully");
      }
    });

    // Set up error handling for auth state changes
    const handleAuthError = (err: Error) => {
      console.error("Auth error:", err);
      if (err.message.includes("User already registered")) {
        setError("This email is already registered. Please try logging in instead.");
      }
    };

    // Subscribe to auth errors
    const { data: { subscription: errorSubscription } } = supabase.auth.onError(handleAuthError);

    return () => {
      subscription.unsubscribe();
      errorSubscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto py-12 flex flex-col justify-center items-center space-y-4">
        {error && (
          <Alert variant="destructive" className="w-[400px]">
            <AlertDescription className="flex flex-col space-y-2">
              {error}
              <Link to="/login" className="text-sm underline">
                Go to login page
              </Link>
            </AlertDescription>
          </Alert>
        )}
        <Card className="w-[400px]">
          <CardContent className="pt-6">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="light"
              providers={[]}
              view="sign_up"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;