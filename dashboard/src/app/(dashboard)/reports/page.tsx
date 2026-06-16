'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
  FileText,
  Star,
  Download,
  ArrowUpRight,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
import { getProductReports, mockProducts } from '@/lib/mock-data';
import { formatDate, timeAgo } from '@/lib/utils';
import type { Report } from '@/types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function ReportsPage() {
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    if (selectedProduct === 'all') {
      const all = Object.values(getProductReports('prod-1'))
        .concat(Object.values(getProductReports('prod-2')))
        .concat(Object.values(getProductReports('prod-3')))
        .concat(Object.values(getProductReports('prod-4')))
        .concat(Object.values(getProductReports('prod-5')));
      setReports(all.sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime()));
    } else {
      setReports(getProductReports(selectedProduct));
    }
  }, [selectedProduct]);

  // Chart data: sentiment trends over time
  const chartData = reports
    .slice()
    .reverse()
    .map((r) => ({
      date: formatDate(r.generated_at),
      positive: r.content.sentiment.positive,
      neutral: r.content.sentiment.neutral,
      negative: r.content.sentiment.negative,
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Reports
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Weekly intelligence reports for your products
          </p>
        </div>
      </div>

      {/* Product filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setSelectedProduct('all')}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            selectedProduct === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          All Products
        </button>
        {mockProducts.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProduct(p.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              selectedProduct === p.id
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Sentiment trend chart */}
      {chartData.length > 1 && (
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Sentiment Trend
            </h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} />
                <YAxis stroke="#a1a1aa" fontSize={12} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e4e4e7',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="positive"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                  name="Positive"
                />
                <Line
                  type="monotone"
                  dataKey="neutral"
                  stroke="#eab308"
                  strokeWidth={2}
                  dot={{ fill: '#eab308', r: 4 }}
                  name="Neutral"
                />
                <Line
                  type="monotone"
                  dataKey="negative"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 4 }}
                  name="Negative"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            {[
              { label: 'Positive', color: '#22c55e' },
              { label: 'Neutral', color: '#eab308' },
              { label: 'Negative', color: '#ef4444' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-zinc-600 dark:text-zinc-400">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reports list */}
      <div className="space-y-4">
        {reports.length === 0 && (
          <Card>
            <p className="text-zinc-500 dark:text-zinc-400 text-center py-8">
              No reports yet for this product.
            </p>
          </Card>
        )}
        {reports.map((report) => {
          const product = mockProducts.find(
            (p) => p.id === report.product_id
          );
          const s = report.content.sentiment;
          const complaints = report.content.top_complaints.length;
          const features = report.content.feature_requests.length;

          return (
            <Card
              key={report.id}
              className="hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-zinc-900 dark:text-white">
                      {product?.name || 'Unknown Product'}
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-full">
                      Ready
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                    Generated {timeAgo(report.generated_at)}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-medium text-zinc-900 dark:text-white">
                        {s.positive}% positive
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-red-500">
                      <AlertTriangle className="w-4 h-4" />
                      <span>
                        {complaints} complaint{complaints !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Lightbulb className="w-4 h-4" />
                      <span>
                        {features} request{features !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}