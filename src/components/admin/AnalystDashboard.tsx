import { CreateAnalysisForm } from "./CreateAnalysisForm";
import { AnalysisList } from "./AnalysisList";
import { AnalysisCalendar } from "./AnalysisCalendar";

const AnalystDashboard = () => {
  return (
    <div className="space-y-6">
      <CreateAnalysisForm />
      <AnalysisList />
      <AnalysisCalendar />
    </div>
  );
};

export default AnalystDashboard;