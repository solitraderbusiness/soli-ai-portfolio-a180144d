import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskLevel } from "@/types/analysis";
import { supabase } from "@/integrations/supabase/client";

interface ProfileSectionProps {
  userRiskLevel: RiskLevel | null;
}

export const ProfileSection = ({ userRiskLevel }: ProfileSectionProps) => {
  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Risk Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile?.email && (
          <p className="text-sm text-gray-600">
            Email: {profile.email}
          </p>
        )}
        <p className="text-lg font-medium text-secondary">
          {userRiskLevel || 'Not Set'}
        </p>
        <p className="text-sm text-gray-600">
          {userRiskLevel 
            ? `You are seeing investment opportunities matching your ${userRiskLevel.toLowerCase()} risk profile.`
            : 'Complete the risk assessment to see personalized recommendations.'}
        </p>
      </CardContent>
    </Card>
  );
};