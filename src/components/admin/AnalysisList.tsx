import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Analysis } from "@/types/analysis";

export const AnalysisList = () => {
  const { data: analyses, isLoading } = useQuery({
    queryKey: ['analyses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analysis_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Analysis Posts</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading analyses...</div>
        ) : (
          <div className="space-y-4">
            {analyses?.map((analysis: Analysis) => (
              <div key={analysis.id} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{analysis.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {analysis.content.substring(0, 150)}...
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {analysis.asset_type}
                    </span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      {analysis.risk_level} Risk
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};