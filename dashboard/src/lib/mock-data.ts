// Mock data layer — mirrors the Supabase schema.
// Swap with real supabase queries when the project is live.

import type { Product, Review, Report, ReportContent, DashboardStats } from '@/types';

const now = new Date().toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

// ─── Products ──────────────────────────────────────────────
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    user_id: 'user-1',
    name: 'Ergonomic Chair Pro',
    url: 'https://amazon.com/dp/B09XYZ',
    platform: 'Amazon',
    last_scraped_at: daysAgo(0),
    created_at: daysAgo(60),
  },
  {
    id: 'prod-2',
    user_id: 'user-1',
    name: 'Bluetooth Earbuds X2',
    url: 'https://amazon.com/dp/B08ABC',
    platform: 'Amazon',
    last_scraped_at: daysAgo(1),
    created_at: daysAgo(45),
  },
  {
    id: 'prod-3',
    user_id: 'user-1',
    name: 'LED Desk Lamp',
    url: 'https://shopify.com/led-lamp',
    platform: 'Shopify',
    last_scraped_at: daysAgo(1),
    created_at: daysAgo(30),
  },
  {
    id: 'prod-4',
    user_id: 'user-1',
    name: 'Yoga Mat Premium',
    url: 'https://amazon.com/dp/B07DEF',
    platform: 'Amazon',
    last_scraped_at: daysAgo(2),
    created_at: daysAgo(20),
  },
  {
    id: 'prod-5',
    user_id: 'user-1',
    name: 'Wireless Keyboard K3',
    url: 'https://shopify.com/kb-k3',
    platform: 'Shopify',
    last_scraped_at: daysAgo(3),
    created_at: daysAgo(15),
  },
  {
    id: 'prod-6',
    user_id: 'user-1',
    name: 'Smart Water Bottle',
    url: 'https://amazon.com/dp/B06GHI',
    platform: 'Amazon',
    last_scraped_at: null,
    created_at: daysAgo(10),
  },
];

// ─── Reports ───────────────────────────────────────────────
const makeReport = (id: string, productId: string, productName: string, daysBack: number): Report => ({
  id,
  product_id: productId,
  user_id: 'user-1',
  content: {
    sentiment: {
      positive: 55 + Math.floor(Math.random() * 25),
      neutral: 10 + Math.floor(Math.random() * 15),
      negative: 5 + Math.floor(Math.random() * 15),
    },
    top_complaints: [
      {
        complaint: productName === 'Ergonomic Chair Pro'
          ? 'Seat cushion loses shape after 3 months'
          : productName === 'Bluetooth Earbuds X2'
          ? 'Battery life degrades quickly'
          : 'Packaging could be more eco-friendly',
        frequency: 18 + Math.floor(Math.random() * 15),
        examples: [
          'After 3 months the cushion flattened completely',
          'Seat padding compressed within weeks',
          'Not as supportive as initially',
        ],
      },
      {
        complaint: productName === 'Ergonomic Chair Pro'
          ? 'Armrests are wobbly'
          : productName === 'Bluetooth Earbuds X2'
          ? 'Connection drops in crowded areas'
          : 'User manual is unclear',
        frequency: 9 + Math.floor(Math.random() * 8),
        examples: ['Left armrest wobbles', 'Not stable on hard floors'],
      },
    ],
    feature_requests: [
      {
        request: productName === 'Ergonomic Chair Pro'
          ? 'Adjustable lumbar support height'
          : productName === 'Bluetooth Earbuds X2'
          ? 'Multi-device pairing support'
          : 'USB-C charging port',
        frequency: 22 + Math.floor(Math.random() * 12),
      },
      {
        request: 'More color options',
        frequency: 8 + Math.floor(Math.random() * 6),
      },
    ],
    swot: {
      strengths: [
        'Excellent build quality',
        'Great value for the price point',
        'Comfortable for long-term use',
      ],
      weaknesses: [
        'Inconsistent quality control',
        'Limited color options',
        'Customer support response time',
      ],
      opportunities: [
        'Expand to international markets',
        'Add smart/home integration features',
      ],
      threats: [
        'Increasing competition from lower-cost brands',
        'Rising raw material costs',
      ],
    },
  },
  generated_at: daysAgo(daysBack),
  created_at: daysAgo(daysBack),
});

export const mockReports: Record<string, Report[]> = {
  'prod-1': [
    makeReport('rpt-1', 'prod-1', 'Ergonomic Chair Pro', 0),
    makeReport('rpt-2', 'prod-1', 'Ergonomic Chair Pro', 7),
    makeReport('rpt-3', 'prod-1', 'Ergonomic Chair Pro', 14),
  ],
  'prod-2': [
    makeReport('rpt-4', 'prod-2', 'Bluetooth Earbuds X2', 1),
    makeReport('rpt-5', 'prod-2', 'Bluetooth Earbuds X2', 8),
  ],
  'prod-3': [
    makeReport('rpt-6', 'prod-3', 'LED Desk Lamp', 2),
    makeReport('rpt-7', 'prod-3', 'LED Desk Lamp', 9),
  ],
  'prod-4': [
    makeReport('rpt-8', 'prod-4', 'Yoga Mat Premium', 3),
  ],
  'prod-5': [
    makeReport('rpt-9', 'prod-5', 'Wireless Keyboard K3', 4),
  ],
};

// ─── Data Access Layer ─────────────────────────────────────
// These functions mimic what the Supabase queries will look like.
// Replace the body with real supabase calls when the project is live.

export function getUserProducts(userId: string): Product[] {
  return mockProducts.filter((p) => p.user_id === userId);
}

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

export function getProductReports(productId: string): Report[] {
  return mockReports[productId] || [];
}

export function getLatestReport(productId: string): Report | undefined {
  const reports = getProductReports(productId);
  return reports.sort(
    (a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime()
  )[0];
}

export function getDashboardStats(userId: string): DashboardStats {
  const products = getUserProducts(userId);
  const allReports = Object.values(mockReports).flat();

  const latestReports = allReports
    .sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime())
    .slice(0, 3);

  // Aggregate top complaints across recent reports
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

  const avgSentiment = allReports.length > 0
    ? allReports.reduce((sum, r) => sum + r.content.sentiment.positive / 100, 0) / allReports.length
    : 0;

  const reportsThisWeek = allReports.filter(
    (r) => new Date(r.generated_at).getTime() > Date.now() - 7 * 86400000
  ).length;

  return {
    total_products: products.length,
    total_reviews_analyzed: 3842,
    average_sentiment: Math.round(avgSentiment * 10) / 10,
    reports_this_week: reportsThisWeek,
    recent_reports: latestReports,
    top_complaints: topComplaints,
    top_feature_requests: topRequests,
    products_with_reviews: products.filter((p) => p.last_scraped_at).length,
  };
}