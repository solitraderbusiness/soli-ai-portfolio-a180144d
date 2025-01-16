import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Analysis, RiskLevel } from "@/types/analysis";
import { ChartSection } from "./ChartSection";
import { ProfileSection } from "./ProfileSection";
import { SignalsSection } from "./SignalsSection";
import { AnalysisList } from "./AnalysisList";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserManagement } from "../admin/UserManagement";

const PortfolioDashboard = () => {
  const [userRiskLevel, setUserRiskLevel] = useState<RiskLevel | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user's profile and risk level
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
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

  // Fetch analyses filtered by risk level and date
  const { data: analyses, isLoading: isLoadingAnalyses } = useQuery({
    queryKey: ['filteredAnalyses', userRiskLevel, selectedDate],
    queryFn: async () => {
      if (!userRiskLevel) return [];

      const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
      let query = supabase
        .from('analysis_posts')
        .select('*')
        .eq('risk_level', userRiskLevel)
        .order('created_at', { ascending: false });

      if (formattedDate) {
        query = query.eq('publish_date', formattedDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Analysis[];
    },
    enabled: !!userRiskLevel,
  });

  // Fetch signals filtered by risk level and date
  const { data: signals, isLoading: isLoadingSignals } = useQuery({
    queryKey: ['filteredSignals', userRiskLevel, selectedDate],
    queryFn: async () => {
      if (!userRiskLevel) return [];

      const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
      let query = supabase
        .from('signals')
        .select('*')
        .eq('risk_level', userRiskLevel)
        .order('created_at', { ascending: false });

      if (formattedDate) {
        query = query.eq('created_at::date', formattedDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!userRiskLevel,
  });

  // Create a map of dates to analysis/signal counts
  const dateMap = analyses?.reduce((acc: Record<string, number>, analysis) => {
    if (analysis.publish_date) {
      const date = format(new Date(analysis.publish_date), 'yyyy-MM-dd');
      acc[date] = (acc[date] || 0) + 1;
    }
    return acc;
  }, {});

  useEffect(() => {
    if (profile?.risk_level) {
      setUserRiskLevel(profile.risk_level as RiskLevel);
    }
    setIsAdmin(profile?.role === 'admin');
  }, [profile]);

  return (
    <div className="space-y-6">
      {isAdmin && <UserManagement />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileSection userRiskLevel={userRiskLevel} />
        <SignalsSection 
          isLoading={isLoadingSignals}
          signalsCount={signals?.length || 0}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartSection 
          isLoading={isLoadingAnalyses} 
          chartData={analyses?.reduce((acc: any[], analysis) => {
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
          }, []) || []}
        />

        <Card>
          <CardHeader>
            <CardTitle>Analysis Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasContent: (date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  return !!dateMap?.[dateStr];
                },
              }}
              modifiersStyles={{
                hasContent: {
                  color: 'white',
                  backgroundColor: '#3b82f6',
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      <AnalysisList 
        isLoading={isLoadingAnalyses}
        analyses={analyses}
      />
    </div>
  );
};

export default PortfolioDashboard;