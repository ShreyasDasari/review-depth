import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.2";

Deno.serve(async (req: Request) => {
  const stripeSignature = req.headers.get("stripe-signature");
  if (!stripeSignature) return new Response("No signature", { status: 400 });
  try {
    const body = await req.text();
    const sigParts = stripeSignature.split(",").reduce((acc, p) => { const [k, v] = p.split("="); acc[k.trim()] = v; return acc; }, {} as Record<string, string>);
    const payload = JSON.parse(body);
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    console.log(`Handling event: ${payload.type}`);
    
    if (payload.type.startsWith("customer.subscription.") || payload.type === "checkout.session.completed") {
      const sub = payload.data.object;
      const customerId = sub.customer;
      const { data: profile } = await supabase.from("profiles").select("id").eq("stripe_customer_id", customerId).single();
      if (profile) {
        const subData = {
          id: sub.id, user_id: profile.id, status: sub.status, price_id: sub.items?.data?.[0]?.price?.id || null,
          quantity: sub.items?.data?.[0]?.quantity || 1, cancel_at_period_end: sub.cancel_at_period_end || false,
          current_period_start: new Date((sub.current_period_start || 0) * 1000).toISOString(),
          current_period_end: new Date((sub.current_period_end || 0) * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        };
        await supabase.from("subscriptions").upsert(subData);
      }
      if (payload.type === "checkout.session.completed" && sub.client_reference_id) {
        await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", sub.client_reference_id);
      }
    }
    return new Response(JSON.stringify({ received: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error(err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
