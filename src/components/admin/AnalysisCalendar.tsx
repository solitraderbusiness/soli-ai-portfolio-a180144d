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

export const AnalysisCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

  const { data: analyses } = useQuery({
    queryKey: ['analyses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analysis_posts')
        .select('*')
        .order('publish_date', { ascending: false });
      
      if (error) {
        toast.error("Failed to fetch analyses");
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
    
    // Filter analyses for the selected date
    const dayAnalyses = analyses?.filter(analysis => {
      if (!analysis.publish_date) return false;
      return format(new Date(analysis.publish_date), 'yyyy-MM-dd') === formattedDate;
    });

    if (dayAnalyses && dayAnalyses.length > 0) {
      // For now, we'll show a toast with the count. You can implement a modal or navigation later
      toast.info(`${dayAnalyses.length} analyses found for ${format(selectedDate, 'MMMM d, yyyy')}`);
    } else {
      toast.info(`No analyses found for ${format(selectedDate, 'MMMM d, yyyy')}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
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
              fontWeight: 'bold',
              backgroundColor: '#e2e8f0',
            },
          }}
        />
      </CardContent>
    </Card>
  );
};