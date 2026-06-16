# ReviewDepth Backend API Documentation

This document outlines the Supabase Edge Functions and database schema for ReviewDepth.

## Edge Functions

### 1. `generate-report`
Triggers the full pipeline: Scrapes reviews, analyzes them, and generates a report.

- **URL**: `POST /functions/v1/generate-report`
- **Auth**: Service Role Key or User Token (User must own the product)
- **Body**:
  ```json
  {
    "product_id": "uuid"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Full pipeline completed successfully",
    "report_id": "uuid",
    "reviews_scraped": 10,
    "total_reviews": 50
  }
  ```

### 2. `create-checkout-session`
Creates a Stripe Checkout session for subscriptions.

- **URL**: `POST /functions/v1/create-checkout-session`
- **Auth**: User Token
- **Body**:
  ```json
  {
    "price_id": "stripe_price_id",
    "success_url": "https://yourapp.com/dashboard?session_id={CHECKOUT_SESSION_ID}",
    "cancel_url": "https://yourapp.com/pricing"
  }
  ```
- **Response**:
  ```json
  {
    "url": "https://checkout.stripe.com/..."
  }
  ```

### 3. `stripe-webhook`
Handles Stripe events (internal use).
- **Events handled**: `customer.subscription.*`, `checkout.session.completed`.

---

## Database Schema

### `profiles`
Extended user data.
- `id`: `uuid` (primary key, references auth.users)
- `email`: `text`
- `subscription_tier`: `text` ('starter', 'growth', 'pro')
- `stripe_customer_id`: `text`

### `products`
The items being tracked.
- `id`: `uuid`
- `user_id`: `uuid`
- `name`: `text`
- `url`: `text`
- `platform`: `text` ('amazon', 'shopify', etc.)
- `last_scraped_at`: `timestamptz`

### `reviews`
Raw scraped reviews.
- `id`: `uuid`
- `product_id`: `uuid`
- `external_id`: `text` (unique per product)
- `rating`: `int` (1-5)
- `content`: `text`
- `title`: `text`
- `author`: `text`
- `date`: `timestamptz`

### `reports`
AI-generated analysis.
- `id`: `uuid`
- `product_id`: `uuid`
- `user_id`: `uuid`
- `content`: `jsonb` (Matches `AnalysisReport` interface)
- `generated_at`: `timestamptz`

### `subscriptions`
Stripe subscription records.
- `id`: `text` (Stripe ID)
- `user_id`: `uuid`
- `status`: `text`
- `price_id`: `text`
- `current_period_end`: `timestamptz`
