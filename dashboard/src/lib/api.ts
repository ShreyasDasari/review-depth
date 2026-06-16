/**
 * API service layer — abstracts data access for the dashboard.
 *
 * Currently uses mock data. When the Supabase project goes live,
 * swap the implementation here to use real Supabase queries.
 * No page component imports mock-data.ts directly — they all go through this file.
 */

import type { Product, Report, DashboardStats, ReportContent } from '@/types';
import {
  getUserProducts as mockGetUserProducts,
  getProductById as mockGetProductById,
  getProductReports as mockGetProductReports,
  getLatestReport as mockGetLatestReport,
  getDashboardStats as mockGetDashboardStats,
} from './mock-data';

// ─── Products ──────────────────────────────────────────────

export async function fetchUserProducts(userId: string): Promise<Product[]> {
  // TODO: Replace with Supabase query:
  // const { data } = await supabase.from('products').select('*').eq('user_id', userId);
  return mockGetUserProducts(userId);
}

export async function fetchProductById(id: string): Promise<Product | null> {
  // TODO: Replace with Supabase query:
  // const { data } = await supabase.from('products').select('*').eq('id', id).single();
  return mockGetProductById(id) || null;
}

// ─── Reports ───────────────────────────────────────────────

export async function fetchProductReports(productId: string): Promise<Report[]> {
  // TODO: Replace with Supabase query:
  // const { data } = await supabase.from('reports').select('*').eq('product_id', productId).order('generated_at', { ascending: false });
  return mockGetProductReports(productId);
}

export async function fetchLatestReport(productId: string): Promise<Report | null> {
  return mockGetLatestReport(productId) || null;
}

// ─── Dashboard ─────────────────────────────────────────────

export async function fetchDashboardStats(userId: string): Promise<DashboardStats> {
  return mockGetDashboardStats(userId);
}

// ─── Report Content Helpers ────────────────────────────────

export function extractComplaints(report: Report): ReportContent['top_complaints'] {
  return report.content.top_complaints;
}

export function extractFeatureRequests(report: Report): ReportContent['feature_requests'] {
  return report.content.feature_requests;
}

export function extractSWOT(report: Report): ReportContent['swot'] {
  return report.content.swot;
}

export function getSentimentBreakdown(report: Report): ReportContent['sentiment'] {
  return report.content.sentiment;
}