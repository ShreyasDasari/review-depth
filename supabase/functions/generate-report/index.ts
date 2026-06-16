import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.2';
import { ScraperFactory } from "../../../scraper/src/factory.ts";
import { AnalyzerFactory, AnalyzerType } from "../../../analyzer/src/factory.ts";

Deno.serve(async (req: Request) => {
  try {
    const { product_id, analyzer_type = "rule-based" } = await req.json();
    
    if (!product_id) {
      return new Response(JSON.stringify({ error: "product_id is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Initialize Supabase Client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 2. Fetch product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      throw new Error("Product not found");
    }

    console.log(`Processing product: ${product.name} (${product.url})`);

    // 3. Scrape reviews
    const scraper = ScraperFactory.getScraper(product.platform as any);
    const scrapingResult = await scraper.scrape(product.url);
    const reviews = scrapingResult.reviews;

    console.log(`Scraped ${reviews.length} reviews`);

    // 4. Save/Upsert reviews
    if (reviews.length > 0) {
      const dbReviews = reviews.map(r => ({
        product_id,
        ...r
      }));

      const { error: upsertError } = await supabase
        .from('reviews')
        .upsert(dbReviews, { onConflict: 'product_id, external_id' });

      if (upsertError) throw upsertError;

      // Update last_scraped_at
      await supabase
        .from('products')
        .update({ last_scraped_at: new Date().toISOString() })
        .eq('id', product_id);
    }

    // 5. Fetch all reviews for analysis (including historical ones)
    const { data: allReviews, error: fetchError } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', product_id);

    if (fetchError) throw fetchError;

    // 6. Analyze
    const analyzer = AnalyzerFactory.getAnalyzer(analyzer_type as AnalyzerType, {
      apiKey: Deno.env.get('OPENAI_API_KEY') || '',
    });
    const reportContent = await analyzer.analyze(product_id, allReviews || []);

    // 7. Save report
    const { data: report, error: saveError } = await supabase
      .from('reports')
      .insert({
        product_id,
        user_id: product.user_id,
        content: reportContent
      })
      .select()
      .single();

    if (saveError) throw saveError;

    return new Response(JSON.stringify({ 
      message: "Full pipeline completed successfully", 
      report_id: report.id,
      reviews_scraped: reviews.length,
      total_reviews: allReviews?.length || 0,
      analyzer_used: analyzer_type
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
