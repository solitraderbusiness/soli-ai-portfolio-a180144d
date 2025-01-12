import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const AnalystDashboard = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual post creation logic
    toast({
      title: "Success",
      description: "Analysis posted successfully",
    });
    setTitle("");
    setContent("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Analysis Post</CardTitle>
          <CardDescription>
            Share your market insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter analysis title"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your analysis here..."
                required
                className="min-h-[200px]"
              />
            </div>
            <Button type="submit">Post Analysis</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Analysis Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mock data for demonstration */}
            <div className="border-b pb-4">
              <h3 className="font-medium">Market Outlook Q1 2024</h3>
              <p className="text-sm text-gray-600 mt-1">
                Analysis of market trends and predictions for Q1 2024...
              </p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-medium">Cryptocurrency Analysis</h3>
              <p className="text-sm text-gray-600 mt-1">
                Latest insights on cryptocurrency market movements...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalystDashboard;