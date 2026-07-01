import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.2";

Deno.serve(async (req: Request) => {
  try {
    const { price_id, success_url, cancel_url } = await req.json();
    if (!price_id) return new Response(JSON.stringify({ error: "price_id required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const session = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${stripeKey}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        "mode": "subscription", "payment_method_types[]": "card",
        "line_items[0][price]": price_id, "line_items[0][quantity]": "1",
        "client_reference_id": user.id,
        "success_url": success_url || "https://review-depth.vercel.app/dashboard?session_id={CHECKOUT_SESSION_ID}",
        "cancel_url": cancel_url || "https://review-depth.vercel.app/pricing",
      }),
    });

    const data = await session.json();
    return new Response(JSON.stringify({ url: data.url }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
