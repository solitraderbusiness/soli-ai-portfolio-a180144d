import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AuthButtons = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Initiating logout");
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast.error("Failed to log out: " + error.message);
        return;
      }

      // Clear any potential stored session data
      localStorage.removeItem('supabase.auth.token');
      
      // Show success message and redirect
      toast.success("Logged out successfully");
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("An unexpected error occurred during logout");
    }
  };

  return (
    <Button 
      onClick={handleLogout} 
      variant="outline"
      data-testid="logout-button"
    >
      Logout
    </Button>
  );
};