import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const NavBar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }

        console.log("Current session:", session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Profile fetch error:", profileError);
            return;
          }

          console.log("User profile:", profile);
          setUserRole(profile?.role ?? null);
        }
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session);

      if (event === 'SIGNED_OUT') {
        console.log("User signed out, clearing state");
        setUser(null);
        setUserRole(null);
        
        // Clear any potential stored session data
        localStorage.removeItem('supabase.auth.token');
        
        // Redirect to login page
        window.location.href = '/login';
      } else if (session?.user) {
        console.log("User session updated:", session.user);
        setUser(session.user);
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error on auth change:", profileError);
          return;
        }

        setUserRole(profile?.role ?? null);
      }
    });

    return () => {
      console.log("Cleaning up auth listener");
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      console.log("Initiating logout");
      
      // Clear local storage first
      localStorage.removeItem('supabase.auth.token');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast.error("Failed to log out: " + error.message);
        return;
      }

      // Redirect to login page
      window.location.href = '/login';
      
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("An unexpected error occurred during logout");
    }
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            RiskWise
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                
                <Link to="/risk-assessment">
                  <Button variant="ghost">Risk Assessment</Button>
                </Link>

                {(userRole === 'analyst' || userRole === 'admin') && (
                  <Link to="/admin">
                    <Button variant="ghost">Admin</Button>
                  </Link>
                )}

                <Button 
                  onClick={handleLogout} 
                  variant="outline"
                  data-testid="logout-button"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;