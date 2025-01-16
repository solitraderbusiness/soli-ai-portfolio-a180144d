import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Analysis } from "@/types/analysis";

interface AnalysisListProps {
  isLoading: boolean;
  analyses: Analysis[] | undefined;
}

export const AnalysisList = ({ isLoading, analyses }: AnalysisListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Analysis & Signals</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
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
            {analyses?.map((analysis) => (
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
                <div className="mt-2 text-sm text-gray-600">
                  {analysis.entry_price && (
                    <p>Entry Price: ${analysis.entry_price}</p>
                  )}
                  {analysis.target_price && (
                    <p>Target Price: ${analysis.target_price}</p>
                  )}
                  {analysis.stop_loss && (
                    <p>Stop Loss: ${analysis.stop_loss}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};