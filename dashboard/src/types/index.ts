// ReviewDepth — Database types matching the Supabase schema

export interface Profile {
  id: string;
  email: string;
  subscription_tier: 'starter' | 'growth' | 'pro';
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  url: string;
  platform: string;
  last_scraped_at: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  external_id: string;
  rating: number;
  content: string;
  title: string | null;
  author: string | null;
  date: string | null;
  sentiment: string | null;
  created_at: string;
}

export interface ReportContent {
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
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

export interface Report {
  id: string;
  product_id: string;
  user_id: string;
  content: ReportContent;
  generated_at: string;
  created_at: string;
}

export interface DashboardStats {
  total_products: number;
  total_reviews_analyzed: number;
  average_sentiment: number;
  reports_this_week: number;
  recent_reports: Report[];
  top_complaints: ReportContent['top_complaints'];
  top_feature_requests: ReportContent['feature_requests'];
  products_with_reviews: number;
}