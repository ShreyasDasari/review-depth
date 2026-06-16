export type SentimentLabel = "positive" | "neutral" | "negative";

export interface Review {
  external_id: string;
  rating: number;
  title: string;
  content: string;
  author: string;
  date: Date;
  verified_purchase: boolean;
}

export interface AnalysisReport {
  product_id: string;
  period: {
    start: Date;
    end: Date;
  };
  total_reviews: number;
  avg_rating: number;
  sentiment: {
    positive: number; // percentage 0-1
    negative: number;
    neutral: number;
  };
  top_complaints: Array<{
    complaint: string;
    frequency: number;
    examples: string[];
  }>;
  feature_requests: Array<{
    request: string;
    frequency: number;
  }>;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

export interface Analyzer {
  analyze(product_id: string, reviews: Review[]): Promise<AnalysisReport> | AnalysisReport;
}
