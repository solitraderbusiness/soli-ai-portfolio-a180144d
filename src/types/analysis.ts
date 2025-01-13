export type RiskLevel = "Low" | "Medium" | "High";
export type AssetType = "Stocks" | "Gold" | "Crypto" | "Forex" | "ETFs";

export interface Analysis {
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

export type CreateAnalysisInput = Omit<Analysis, 'id' | 'created_at'>;