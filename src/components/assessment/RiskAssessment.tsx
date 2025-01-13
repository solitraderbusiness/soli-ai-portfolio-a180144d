import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const questions = [
  {
    id: 1,
    question: "What is your investment time horizon?",
    options: ["1-3 years", "3-5 years", "5-10 years", "10+ years"],
  },
  {
    id: 2,
    question: "How much investment experience do you have?",
    options: ["None", "Some", "Moderate", "Extensive"],
  },
  {
    id: 3,
    question: "What is your primary investment goal?",
    options: [
      "Capital preservation",
      "Income generation",
      "Balanced growth",
      "Aggressive growth",
    ],
  },
];

const calculateRiskLevel = (answers: Record<number, string>): "Low" | "Medium" | "High" => {
  let riskScore = 0;

  // Time horizon scoring
  const timeHorizonMap: Record<string, number> = {
    "1-3 years": 1,
    "3-5 years": 2,
    "5-10 years": 3,
    "10+ years": 4,
  };
  riskScore += timeHorizonMap[answers[1]] || 0;

  // Experience scoring
  const experienceMap: Record<string, number> = {
    "None": 1,
    "Some": 2,
    "Moderate": 3,
    "Extensive": 4,
  };
  riskScore += experienceMap[answers[2]] || 0;

  // Investment goal scoring
  const goalMap: Record<string, number> = {
    "Capital preservation": 1,
    "Income generation": 2,
    "Balanced growth": 3,
    "Aggressive growth": 4,
  };
  riskScore += goalMap[answers[3]] || 0;

  // Calculate final risk level
  const avgScore = riskScore / 3;
  if (avgScore <= 2) return "Low";
  if (avgScore <= 3) return "Medium";
  return "High";
};

const RiskAssessment = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length !== questions.length) {
      toast({
        title: "Error",
        description: "Please answer all questions",
        variant: "destructive",
      });
      return;
    }

    try {
      const riskLevel = calculateRiskLevel(answers);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          risk_level: riskLevel,
          personality_profile: answers
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Risk assessment completed",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error('Error saving risk assessment:', error);
      toast({
        title: "Error",
        description: "Failed to save risk assessment",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Risk Assessment
        </CardTitle>
        <CardDescription className="text-center">
          Please answer these questions to help us understand your risk tolerance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <label className="text-sm font-medium">{q.question}</label>
              <Select
                onValueChange={(value) =>
                  setAnswers((prev) => ({ ...prev, [q.id]: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {q.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          <Button type="submit" className="w-full">
            Complete Assessment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RiskAssessment;