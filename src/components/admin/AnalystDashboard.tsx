import { CreateAnalysisForm } from "./CreateAnalysisForm";
import { AnalysisList } from "./AnalysisList";

const AnalystDashboard = () => {
  return (
    <div className="space-y-6">
      <CreateAnalysisForm />
      <AnalysisList />
    </div>
  );
};

export default AnalystDashboard;