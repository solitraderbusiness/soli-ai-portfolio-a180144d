import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Analysis } from "@/types/analysis";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartLineUp, ArrowUpRight, ArrowDownRight, Ban } from "lucide-react";

export const AnalysisList = () => {
  const { data: analyses, isLoading, error } = useQuery({
    queryKey: ['analyses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analysis_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error("Failed to fetch analyses");
        throw error;
      }
      return data as Analysis[];
    },
  });

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getDirectionIcon = (content: string) => {
    if (content.toLowerCase().includes('buy') || content.toLowerCase().includes('long')) {
      return <ArrowUpRight className="w-5 h-5 text-green-600" />;
    } else if (content.toLowerCase().includes('sell') || content.toLowerCase().includes('short')) {
      return <ArrowDownRight className="w-5 h-5 text-red-600" />;
    }
    return <Ban className="w-5 h-5 text-gray-600" />;
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartLineUp className="w-6 h-6" />
            Market Analysis Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Failed to load analyses</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartLineUp className="w-6 h-6" />
          Market Analysis Posts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : analyses && analyses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Direction</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Asset</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Entry</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Target</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Stop Loss</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((analysis: Analysis) => (
                  <tr 
                    key={analysis.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {getDirectionIcon(analysis.content)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {analysis.asset_type}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {analysis.title}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      {analysis.entry_price || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      {analysis.target_price || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      {analysis.stop_loss || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${getRiskColor(analysis.risk_level)}`}>
                        {analysis.risk_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No analysis posts found. Create your first analysis using the form above.
          </div>
        )}
      </CardContent>
    </Card>
  );
};