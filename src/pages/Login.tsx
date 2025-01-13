import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/shared/NavBar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { AuthError } from "@supabase/supabase-js";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/dashboard");
      }
      // Clear error when auth state changes
      if (event === "SIGNED_OUT") {
        setError(null);
      }
    });

    // Listen for auth errors
    const handleAuthError = (error: AuthError) => {
      if (error.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please check your credentials and try again.");
      } else {
        setError(error.message);
      }
    };

    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "USER_UPDATED" && !session) {
        handleAuthError({ message: "Authentication failed" } as AuthError);
      }
    });

    return () => {
      subscription.unsubscribe();
      authListener.data.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto py-12 flex flex-col justify-center items-center space-y-4">
        {error && (
          <Alert variant="destructive" className="w-[400px]">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Card className="w-[400px]">
          <CardContent className="pt-6">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="light"
              providers={[]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;