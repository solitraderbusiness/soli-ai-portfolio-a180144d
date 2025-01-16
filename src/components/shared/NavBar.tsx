import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

const NavBar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session and user role
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          setUserRole(profile?.role ?? null);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setUserRole(profile?.role ?? null);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      // Clear user state
      setUser(null);
      setUserRole(null);
      
      // Navigate to home page
      navigate("/");
      
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-primary py-4 px-6 shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          PortfolioManager
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-white hover:text-gray-200">
                Dashboard
              </Link>
              {(userRole === 'analyst' || userRole === 'admin') && (
                <Link to="/admin" className="text-white hover:text-gray-200">
                  Analyst Dashboard
                </Link>
              )}
              <span className="text-white">{user.email}</span>
              <Button
                variant="secondary"
                className="hover:bg-secondary/90"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-gray-200">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-secondary px-4 py-2 rounded-lg text-white hover:bg-secondary/90"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;