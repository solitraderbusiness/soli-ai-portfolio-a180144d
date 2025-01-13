import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SignalsSectionProps {
  isLoading: boolean;
  signalsCount: number;
}

export const SignalsSection = ({ isLoading, signalsCount }: SignalsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Signals</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium text-secondary">
          {isLoading ? (
            <Skeleton className="h-6 w-20 inline-block" />
          ) : (
            `${signalsCount} Signals`
          )}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Current investment opportunities matching your risk profile.
        </p>
      </CardContent>
    </Card>
  );
};