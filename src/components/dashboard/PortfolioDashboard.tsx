import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Analysis, RiskLevel } from "@/types/analysis";
import { useToast } from "@/hooks/use-toast";

const PortfolioDashboard = () => {
  const { toast } = useToast();
  const [userRiskLevel, setUserRiskLevel] = useState<RiskLevel | null>(null);

  // Fetch user's risk level
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('profiles')
        .select('risk_level')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch analyses filtered by risk level
  const { data: analyses, isLoading: isLoadingAnalyses } = useQuery({
    queryKey: ['filteredAnalyses', userRiskLevel],
    queryFn: async () => {
      if (!userRiskLevel) return [];

      const { data, error } = await supabase
        .from('analysis_posts')
        .select('*')
        .eq('risk_level', userRiskLevel)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Analysis[];
    },
    enabled: !!userRiskLevel,
  });

  useEffect(() => {
    if (profile?.risk_level) {
      setUserRiskLevel(profile.risk_level as RiskLevel);
    }
  }, [profile]);

  // Transform analyses data for the chart
  const chartData = analyses?.reduce((acc: any[], analysis) => {
    const existingAsset = acc.find(item => item.name === analysis.asset_type);
    if (existingAsset) {
      existingAsset.count += 1;
    } else {
      acc.push({
        name: analysis.asset_type,
        count: 1,
      });
    }
    return acc;
  }, []) || [];

  if (isLoadingProfile) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recommended Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingAnalyses ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#1E3A8A"
                    name="Number of Recommendations"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <Card>
          <CardHeader>
            <CardTitle>Available Signals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-secondary">
              {isLoadingAnalyses ? (
                <Skeleton className="h-6 w-20 inline-block" />
              ) : (
                `${analyses?.length || 0} Signals`
              )}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Current investment opportunities matching your risk profile.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest Analysis Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingAnalyses ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b pb-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {analyses?.slice(0, 5).map((analysis) => (
                <div key={analysis.id} className="border-b pb-4">
                  <h3 className="font-medium">{analysis.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {analysis.asset_type}
                    </span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      {analysis.risk_level} Risk
                    </span>
                  </div>
                  {analysis.entry_price && (
                    <p className="text-sm text-gray-600 mt-1">
                      Entry Price: ${analysis.entry_price}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioDashboard;