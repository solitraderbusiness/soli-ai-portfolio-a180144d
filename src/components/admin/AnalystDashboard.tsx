import { CreateAnalysisForm } from "./CreateAnalysisForm";
import { AnalysisList } from "./AnalysisList";
import { AnalysisCalendar } from "./AnalysisCalendar";
import { UserManagement } from "./UserManagement";
import { Card, CardContent } from "@/components/ui/card";

const AnalystDashboard = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Analyst Dashboard</h1>
      <div className="grid gap-8">
        <Card>
          <CardContent className="pt-6">
            <CreateAnalysisForm />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnalysisList />
          <AnalysisCalendar />
        </div>

        <Card>
          <CardContent className="pt-6">
            <UserManagement />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalystDashboard;