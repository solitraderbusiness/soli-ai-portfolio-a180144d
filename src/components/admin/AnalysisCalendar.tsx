import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Analysis } from "@/types/analysis";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export const AnalysisCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

  const { data: analyses, isLoading, error } = useQuery({
    queryKey: ['analyses-calendar'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analysis_posts')
        .select('*')
        .order('publish_date', { ascending: false });
      
      if (error) {
        toast.error("Failed to fetch analyses for calendar");
        throw error;
      }
      return data as Analysis[];
    },
  });

  // Create a map of dates to analysis counts
  const analysisDateMap = analyses?.reduce((acc, analysis) => {
    if (analysis.publish_date) {
      const date = format(new Date(analysis.publish_date), 'yyyy-MM-dd');
      acc[date] = (acc[date] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    
    setDate(selectedDate);
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    navigate(`/daily-analyses/${formattedDate}`);
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analysis Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Failed to load calendar data</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <>
            <div className="mb-4 flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">Has Analyses</span>
              </div>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md border"
              modifiers={{
                hasAnalysis: (date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  return !!analysisDateMap?.[dateStr];
                },
              }}
              modifiersStyles={{
                hasAnalysis: {
                  color: 'white',
                  backgroundColor: '#3b82f6',
                },
              }}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};