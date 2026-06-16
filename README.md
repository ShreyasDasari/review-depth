# ReviewDepth 🧠

AI-powered product review intelligence for e-commerce store owners.

## Structure

```
├── dashboard/          # Next.js 16 customer dashboard (App Router, Tailwind, recharts)
├── scraper/            # Modular review scraping engine (Amazon, Shopify)
├── analyzer/           # AI report generation (rule-based + LLM)
├── supabase/
│   ├── functions/      # Edge functions (pipeline, Stripe billing)
│   └── migrations/     # Database schema
├── API_DOCS.md         # Backend API specifications
└── SUBSCRIPTION_PRICES.md
```

## Quick Start

**Dashboard:** `cd dashboard && npm install && npm run dev`
**Scraper:** `deno test scraper/tests/`
**Analyzer:** `deno test analyzer/tests/`
**Edge Functions:** Deploy to Supabase with `supabase functions deploy`

## Pricing

| Tier | Price | Products | Reports |
|------|-------|----------|---------|
| Starter | $19/mo | 50 | Weekly |
| Growth | $49/mo | 200 | Weekly + CSV |
| Pro | $79/mo | Unlimited | Daily + Slack |