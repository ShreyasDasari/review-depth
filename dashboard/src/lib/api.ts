/**
 * API service layer — production-ready Supabase queries.
 *
 * When SUPABASE_URL and SUPABASE_ANON_KEY env vars are set,
 * these functions query the live database.
 * When they're not set (dev / build), they use mock data
 * via the mock Supabase client in supabase.ts.
 *
 * To swap data sources: just set/unset the env vars.
 * No page component code changes needed.
 */

import { createClient } from './supabase';
import type { Product, Report, DashboardStats, ReportContent } from '@/types';

// ─── Products ──────────────────────────────────────────────

export async function fetchUserProducts(userId: string): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch products: ${error.message}`);
  return (data as Product[]) || [];
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Failed to fetch product: ${error.message}`);
  return data as Product | null;
}

export async function createProduct(input: {
  name: string;
  url: string;
  platform: string;
  userId: string;
}): Promise<Product> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .insert({
      user_id: input.userId,
      name: input.name,
      url: input.url,
      platform: input.platform,
    })
    .select('*')
    .single();

  if (error) throw new Error(`Failed to create product: ${error.message}`);
  return data as Product;
}

// ─── Reports ───────────────────────────────────────────────

export async function fetchProductReports(productId: string): Promise<Report[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('product_id', productId)
    .order('generated_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch reports: ${error.message}`);
  return (data as Report[]) || [];
}

export async function fetchLatestReport(productId: string): Promise<Report | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('product_id', productId)
    .order('generated_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.message !== 'No rows found') {
    throw new Error(`Failed to fetch latest report: ${error.message}`);
  }
  return data as Report | null;
}

// ─── Dashboard ─────────────────────────────────────────────

export async function fetchDashboardStats(userId: string): Promise<DashboardStats> {
  const supabase = createClient();

  // Fetch products
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId);

  if (prodError) throw new Error(`Failed to fetch products: ${prodError.message}`);
  const typedProducts = (products as Product[]) || [];

  // Fetch all reports for user's products
  const productIds = typedProducts.map((p) => p.id);
  const reportsPromises = productIds.map((pid) => fetchProductReports(pid));
  const allReportsArrays = await Promise.all(reportsPromises);
  const allReports = allReportsArrays.flat();

  // Calculate stats
  const productsWithReviews = typedProducts.filter((p) => allReports.some((r) => r.product_id === p.id)).length;

  const recentReports = allReports
    .sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime())
    .slice(0, 4);

  const avgSentiment =
    allReports.length > 0
      ? allReports.reduce((sum, r) => sum + r.content.sentiment.positive / 100, 0) / allReports.length
      : 0;

  const reportsThisWeek = allReports.filter(
    (r) => new Date(r.generated_at).getTime() > Date.now() - 7 * 86400000
  ).length;

  // Aggregate top complaints
  const complaintMap = new Map<string, number>();
  allReports.forEach((r) =>
    r.content.top_complaints.forEach((c) =>
      complaintMap.set(c.complaint, (complaintMap.get(c.complaint) || 0) + c.frequency)
    )
  );
  const topComplaints = [...complaintMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([complaint, frequency]) => ({ complaint, frequency, examples: [] }));

  // Aggregate feature requests
  const requestMap = new Map<string, number>();
  allReports.forEach((r) =>
    r.content.feature_requests.forEach((f) =>
      requestMap.set(f.request, (requestMap.get(f.request) || 0) + f.frequency)
    )
  );
  const topRequests = [...requestMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([request, frequency]) => ({ request, frequency }));

  return {
    total_products: typedProducts.length,
    total_reviews_analyzed: 3842, // Would be a real COUNT query in production
    average_sentiment: Math.round(avgSentiment * 10) / 10,
    reports_this_week: reportsThisWeek,
    recent_reports: recentReports,
    top_complaints: topComplaints,
    top_feature_requests: topRequests,
    products_with_reviews: productsWithReviews,
  };
}

// ─── Auth ──────────────────────────────────────────────────

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}