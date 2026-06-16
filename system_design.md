# ReviewDepth System Architecture

## Overview
ReviewDepth is an AI-powered intelligence platform that scrapes product reviews and generates actionable insights for e-commerce store owners.

## Components

### 1. Frontend (Next.js)
- **Dashboard:** Main UI for users to manage tracked products and view reports.
- **Auth UI:** Login, signup, and magic link handling.
- **Data Visualization:** Charts for sentiment trends and SWOT analysis.

### 2. Backend (Supabase)
- **Postgres Database:** Stores user profiles, products, reviews, and reports.
- **Supabase Auth:** Handles user authentication and session management.
- **Edge Functions:**
  - `scrape-reviews`: Scrapes Amazon and other platforms for new reviews.
  - `generate-report`: Uses AI to analyze reviews and generate weekly intelligence reports.
- **Storage:** (Optional) If we need to store raw scraping artifacts or generated PDFs.

## Data Flow

1. **User Onboarding:**
   - User signs up via Supabase Auth.
   - Profile is created in the `profiles` table.

2. **Product Tracking:**
   - User adds a product URL to the dashboard.
   - Entry is created in the `products` table.

3. **Scraping Pipeline:**
   - `scrape-reviews` edge function is triggered (cron or manual).
   - Reviews are parsed and saved to the `reviews` table.
   - Deduplication is handled by `external_id` (platform-specific review ID).

4. **Intelligence Generation:**
   - `generate-report` edge function is triggered weekly.
   - Recent reviews are fetched for a product.
   - LLM processes content for sentiment, complaints, and SWOT.
   - Report is saved to the `reports` table.

5. **Reporting:**
   - User receives an email/notification or views the dashboard.

## Authentication & Security
- **RLS (Row Level Security):** 
  - Users can only access `products` where `user_id` matches their ID.
  - `reviews` and `reports` are accessed via their relationship to `products`.
- **Auth:** Email/Password and Magic Link supported via Supabase.

## Tech Stack
- **Database:** PostgreSQL (Supabase)
- **Backend:** Deno Edge Functions
- **AI:** Gemini/OpenAI (via Edge Functions)
- **Frontend:** Next.js + Tailwind CSS
