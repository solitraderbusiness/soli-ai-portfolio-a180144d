export type RiskLevel = "Low" | "Medium" | "High";
export type AssetType = "Stocks" | "Gold" | "Crypto" | "Forex" | "ETFs";

export interface Analysis {
  id: string;
  title: string;
  content: string;
  risk_level: RiskLevel;
  asset_type: AssetType;
  entry_price: number | null;
  stop_loss: number | null;
  target_price: number | null;
  created_at: string;
  updated_at: string;
  publish_date: string | null;
  author_id: string | null;
}

export type CreateAnalysisInput = Omit<Analysis, 'id' | 'created_at' | 'updated_at' | 'publish_date'>;