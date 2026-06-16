# ReviewDepth Subscription Tiers

These are the placeholder Stripe Price IDs for the ReviewDepth SaaS tiers.

| Tier | Price | Interval | Stripe Price ID (Test Mode Placeholder) |
| --- | --- | --- | --- |
| **Starter** | $19.00 | Monthly | `price_starter_monthly` |
| **Growth** | $49.00 | Monthly | `price_growth_monthly` |
| **Pro** | $79.00 | Monthly | `price_pro_monthly` |

## Webhook Config
The `stripe-webhook` edge function should be configured in the Stripe Dashboard with the following events:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `checkout.session.completed`

## Environment Variables Needed
- `STRIPE_SECRET_KEY`: Your Stripe Secret Key.
- `STRIPE_WEBHOOK_SECRET`: The signing secret from the Stripe CLI or Dashboard.
- `OPENAI_API_KEY`: Needed if `analyzer_type` is set to `llm`.
- `SUPABASE_URL`: Standard Supabase env var.
- `SUPABASE_SERVICE_ROLE_KEY`: Standard Supabase env var.
