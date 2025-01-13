import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskLevel } from "@/types/analysis";

interface ProfileSectionProps {
  userRiskLevel: RiskLevel | null;
}

export const ProfileSection = ({ userRiskLevel }: ProfileSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Risk Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium text-secondary">
          {userRiskLevel || 'Not Set'}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          {userRiskLevel 
            ? `You are seeing investment opportunities matching your ${userRiskLevel.toLowerCase()} risk profile.`
            : 'Complete the risk assessment to see personalized recommendations.'}
        </p>
      </CardContent>
    </Card>
  );
};