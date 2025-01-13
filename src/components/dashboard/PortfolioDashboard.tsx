import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Analysis, RiskLevel } from "@/types/analysis";
import { ChartSection } from "./ChartSection";
import { ProfileSection } from "./ProfileSection";
import { SignalsSection } from "./SignalsSection";
import { AnalysisList } from "./AnalysisList";

const PortfolioDashboard = () => {
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

  return (
    <div className="space-y-6">
      <ChartSection 
        isLoading={isLoadingAnalyses} 
        chartData={chartData} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileSection userRiskLevel={userRiskLevel} />
        <SignalsSection 
          isLoading={isLoadingAnalyses}
          signalsCount={analyses?.length || 0}
        />
      </div>

      <AnalysisList 
        isLoading={isLoadingAnalyses}
        analyses={analyses}
      />
    </div>
  );
};

export default PortfolioDashboard;