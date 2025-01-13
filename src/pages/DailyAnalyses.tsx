import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Analysis } from "@/types/analysis";
import NavBar from "@/components/shared/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const DailyAnalyses = () => {
  const { date } = useParams();
  
  const { data: analyses, isLoading } = useQuery({
    queryKey: ['analyses', date],
    queryFn: async () => {
      if (!date) throw new Error("No date provided");
      
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const { data, error } = await supabase
        .from('analysis_posts')
        .select('*')
        .gte('publish_date', startOfDay.toISOString())
        .lt('publish_date', endOfDay.toISOString())
        .order('publish_date', { ascending: false });
      
      if (error) {
        toast.error("Failed to fetch analyses");
        throw error;
      }
      return data as Analysis[];
    },
  });

  // Safely parse the date parameter
  const formattedDate = date ? format(parseISO(date), 'MMMM d, yyyy') : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">
          Analyses for {formattedDate}
        </h1>
        {isLoading ? (
          <div>Loading analyses...</div>
        ) : (
          <div className="space-y-6">
            {!analyses?.length ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-gray-500">
                    No analyses found for this date.
                  </p>
                </CardContent>
              </Card>
            ) : (
              analyses?.map((analysis) => (
                <Card key={analysis.id}>
                  <CardHeader>
                    <CardTitle>{analysis.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">{analysis.content}</p>
                      <div className="flex gap-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {analysis.asset_type}
                        </span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {analysis.risk_level} Risk
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyAnalyses;