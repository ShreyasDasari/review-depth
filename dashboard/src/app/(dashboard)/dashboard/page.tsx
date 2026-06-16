'use client';

import { useState, useEffect } from 'react';
import { Card, StatCard } from '@/components/ui/card';
import {
  Package,
  FileText,
  Star,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Minus,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { getDashboardStats, getLatestReport } from '@/lib/mock-data';
import { formatDate, sentimentColor } from '@/lib/utils';
import type { DashboardStats, Report } from '@/types';

const COLORS = {
  positive: '#22c55e',
  neutral: '#eab308',
  negative: '#ef4444',
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    // Simulate loading data
    const data = getDashboardStats('user-1');
    setStats(data);
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sentimentScore = stats.average_sentiment;
  const sentimentLabel =
    sentimentScore >= 0.7 ? 'Positive' : sentimentScore >= 0.4 ? 'Mixed' : 'Negative';
  const sentimentIcon =
    sentimentScore >= 0.7
      ? ThumbsUp
      : sentimentScore >= 0.4
      ? Minus
      : ThumbsDown;
  const SentimentIcon = sentimentIcon;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Overview of your tracked products and recent insights
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Products Tracked"
          value={stats.total_products}
          subtitle={`${stats.products_with_reviews} with reviews`}
          icon={<Package className="w-5 h-5" />}
          trend={{ value: 20, positive: true }}
        />
        <StatCard
          title="Reviews Analyzed"
          value={stats.total_reviews_analyzed.toLocaleString()}
          subtitle="All time"
          icon={<FileText className="w-5 h-5" />}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Avg. Sentiment"
          value={sentimentLabel}
          subtitle={`${(sentimentScore * 100).toFixed(0)}% positive`}
          icon={
            <SentimentIcon
              className={`w-5 h-5 ${
                sentimentScore >= 0.7
                  ? 'text-green-500'
                  : sentimentScore >= 0.4
                  ? 'text-yellow-500'
                  : 'text-red-500'
              }`}
            />
          }
          trend={{ value: 3, positive: true }}
        />
        <StatCard
          title="Reports This Week"
          value={stats.reports_this_week}
          subtitle="Generated automatically"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Sentiment pie + Top complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Breakdown */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Sentiment Breakdown
            </h2>
          </div>
          {stats.recent_reports.length > 0 && (
            <div className="flex items-center justify-center h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: 'Positive',
                        value:
                          stats.recent_reports[0].content.sentiment.positive,
                      },
                      {
                        name: 'Neutral',
                        value:
                          stats.recent_reports[0].content.sentiment.neutral,
                      },
                      {
                        name: 'Negative',
                        value:
                          stats.recent_reports[0].content.sentiment.negative,
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name = '', percent = 0 }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {(['positive', 'neutral', 'negative'] as const).map(
                      (key) => (
                        <Cell key={key} fill={COLORS[key]} />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex items-center justify-center gap-6 mt-2 text-sm">
            {(
              [
                { label: 'Positive', key: 'positive' as const },
                { label: 'Neutral', key: 'neutral' as const },
                { label: 'Negative', key: 'negative' as const },
              ] as const
            ).map(({ label, key }) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[key] }}
                />
                <span className="text-zinc-600 dark:text-zinc-400">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Complaints */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Top Complaints
            </h2>
          </div>
          <ul className="space-y-3">
            {stats.top_complaints.map((item) => (
              <li
                key={item.complaint}
                className="flex items-start justify-between gap-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/20"
              >
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  {item.complaint}
                </p>
                <span className="shrink-0 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                  {item.frequency}x
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Feature requests + Report cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Feature Requests
            </h2>
          </div>
          <ul className="space-y-3">
            {stats.top_feature_requests.map((item) => (
              <li
                key={item.request}
                className="flex items-start justify-between gap-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20"
              >
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  {item.request}
                </p>
                <span className="shrink-0 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                  {item.frequency}x
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Recent Reports */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Recent Reports
              </h2>
            </div>
            <Link
              href="/reports"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ul className="space-y-3">
            {stats.recent_reports.map((report) => {
              const product = [
                { id: 'prod-1', name: 'Ergonomic Chair Pro' },
                { id: 'prod-2', name: 'Bluetooth Earbuds X2' },
                { id: 'prod-3', name: 'LED Desk Lamp' },
                { id: 'prod-4', name: 'Yoga Mat Premium' },
                { id: 'prod-5', name: 'Wireless Keyboard K3' },
              ].find((p) => p.id === report.product_id);

              const pos = report.content.sentiment.positive;

              return (
                <Link
                  key={report.id}
                  href="/reports"
                  className="block p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {product?.name || 'Unknown Product'}
                    </p>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        pos >= 60
                          ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30'
                          : pos >= 40
                          ? 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30'
                          : 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30'
                      }`}
                    >
                      {pos}% positive
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    {formatDate(report.generated_at)}
                  </p>
                </Link>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}