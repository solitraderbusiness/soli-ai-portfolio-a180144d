import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roleRequired?: "analyst" | "admin";
}

const LoadingState = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, roleRequired }: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setLoading(false);
          return;
        }

        setUser(session.user);

        // Get the user's profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast({
            title: "Error",
            description: "Failed to fetch user profile",
            variant: "destructive",
          });
          return;
        }

        setUserRole(profile?.role ?? null);
      } catch (error) {
        console.error('Error checking auth state:', error);
        toast({
          title: "Error",
          description: "Failed to verify authentication status",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserRole(null);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setUserRole(profile?.role ?? null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  if (loading) {
    return <LoadingState />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roleRequired && userRole !== roleRequired) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this page",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;