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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type RiskLevel = "Low" | "Medium" | "High";
type AssetType = "Stocks" | "Gold" | "Crypto" | "Forex" | "ETFs";

interface Analysis {
  id: string;
  title: string;
  content: string;
  risk_level: RiskLevel;
  asset_type: AssetType;
  entry_price?: number;
  stop_loss?: number;
  target_price?: number;
  created_at: Date;
  author_id: string;
}

const AnalystDashboard = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("Medium");
  const [assetType, setAssetType] = useState<AssetType>("Stocks");
  const [entryPrice, setEntryPrice] = useState<string>("");
  const [stopLoss, setStopLoss] = useState<string>("");
  const [targetPrice, setTargetPrice] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch analysis posts
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

  // Create analysis mutation
  const createAnalysis = useMutation({
    mutationFn: async (newAnalysis: Omit<Analysis, 'id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('analysis_posts')
        .insert([{ ...newAnalysis, author_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
      toast({
        title: "Success",
        description: "Analysis posted successfully",
      });
      // Reset form
      setTitle("");
      setContent("");
      setEntryPrice("");
      setStopLoss("");
      setTargetPrice("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to post analysis. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating analysis:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createAnalysis.mutate({
      title,
      content,
      risk_level: riskLevel,
      asset_type: assetType,
      entry_price: entryPrice ? parseFloat(entryPrice) : undefined,
      stop_loss: stopLoss ? parseFloat(stopLoss) : undefined,
      target_price: targetPrice ? parseFloat(targetPrice) : undefined,
      author_id: "", // This will be set in the mutation function
    });
  };

  // ... keep existing code (form JSX)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Analysis Post</CardTitle>
          <CardDescription>
            Share your market insights and trading signals
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="riskLevel" className="text-sm font-medium">
                  Risk Level
                </label>
                <Select
                  value={riskLevel}
                  onValueChange={(value) => setRiskLevel(value as RiskLevel)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low Risk</SelectItem>
                    <SelectItem value="Medium">Medium Risk</SelectItem>
                    <SelectItem value="High">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="assetType" className="text-sm font-medium">
                  Asset Type
                </label>
                <Select
                  value={assetType}
                  onValueChange={(value) => setAssetType(value as AssetType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Stocks">Stocks</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Crypto">Crypto</SelectItem>
                    <SelectItem value="Forex">Forex</SelectItem>
                    <SelectItem value="ETFs">ETFs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="entryPrice" className="text-sm font-medium">
                  Entry Price
                </label>
                <Input
                  id="entryPrice"
                  type="number"
                  step="0.01"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="stopLoss" className="text-sm font-medium">
                  Stop Loss
                </label>
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.01"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="targetPrice" className="text-sm font-medium">
                  Target Price
                </label>
                <Input
                  id="targetPrice"
                  type="number"
                  step="0.01"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Analysis Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your detailed market analysis here..."
                required
                className="min-h-[200px]"
              />
            </div>

            <Button 
              type="submit" 
              disabled={createAnalysis.isPending}
            >
              {createAnalysis.isPending ? "Posting..." : "Post Analysis"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Analysis Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading analyses...</div>
          ) : (
            <div className="space-y-4">
              {analyses?.map((analysis) => (
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
    </div>
  );
};

export default AnalystDashboard;
