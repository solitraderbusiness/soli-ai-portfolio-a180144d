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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RiskLevel, AssetType, CreateAnalysisInput } from "@/types/analysis";

export const CreateAnalysisForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("Medium");
  const [assetType, setAssetType] = useState<AssetType>("Stocks");
  const [entryPrice, setEntryPrice] = useState<string>("");
  const [stopLoss, setStopLoss] = useState<string>("");
  const [targetPrice, setTargetPrice] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createAnalysis = useMutation({
    mutationFn: async (newAnalysis: CreateAnalysisInput) => {
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

  return (
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
  );
};