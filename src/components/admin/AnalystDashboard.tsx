import { CreateAnalysisForm } from "./CreateAnalysisForm";
import { AnalysisList } from "./AnalysisList";
import { AnalysisCalendar } from "./AnalysisCalendar";

const AnalystDashboard = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-8">Analyst Dashboard</h1>
      <div className="grid grid-cols-1 gap-8">
        <CreateAnalysisForm />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnalysisList />
          <AnalysisCalendar />
        </div>
      </div>
    </div>
  );
};

export default AnalystDashboard;