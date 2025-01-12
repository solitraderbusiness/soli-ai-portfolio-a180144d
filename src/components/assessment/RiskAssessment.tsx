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

const RiskAssessment = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length !== questions.length) {
      toast({
        title: "Error",
        description: "Please answer all questions",
        variant: "destructive",
      });
      return;
    }
    // TODO: Calculate risk profile based on answers
    toast({
      title: "Success",
      description: "Risk assessment completed",
    });
    navigate("/dashboard");
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