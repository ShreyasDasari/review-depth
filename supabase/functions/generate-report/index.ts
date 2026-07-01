import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.2";

// ─── Scraper Types ────────────────────────────────────────
interface Review {
  external_id: string; rating: number; title: string; content: string;
  author: string; date: Date; verified_purchase: boolean;
}
interface ScrapingResult { reviews: Review[]; nextPageUrl?: string; hasMore: boolean; }
interface Scraper { scrape(url: string): Promise<ScrapingResult>; }
function deduplicateReviews(reviews: Review[]): Review[] {
  const seen = new Set<string>(); return reviews.filter((r) => { if (seen.has(r.external_id)) return false; seen.add(r.external_id); return true; });
}

// ─── Amazon Scraper ───────────────────────────────────────
class AmazonScraper implements Scraper {
  async scrape(url: string): Promise<ScrapingResult> {
    const html = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", "Accept-Language": "en-US,en;q=0.9" } }).then(r => r.text());
    if (html.includes("api-services-support@amazon.com") || html.includes("captcha")) throw new Error("CAPTCHA detected");
    const reviews: Review[] = [];
    const idMatch = url.match(/\/dp\/(\w+)/) || url.match(/\/product-reviews\/(\w+)/);
    const asin = idMatch?.[1] || "unknown";
    const lines = html.split("\n");
    let i = 0;
    while (i < lines.length) {
      if (lines[i].includes('data-hook="review"') || (lines[i].includes('review') && lines[i].includes('"a-section"'))) {
        const block = lines.slice(i, i + 40).join("\n");
        const ratingMatch = block.match(/class="a-icon-alt"[^>]*>([\d.]+)/);
        const titleMatch = block.match(/data-hook="review-title"[^>]*>([^<]+)/) || block.match(/<a[^>]*class="a-size-base"[^>]*>([^<]+)/);
        const contentMatch = block.match(/data-hook="review-body"[^>]*>([^<]+)/) || block.match(/class="review-text"[^>]*>([^<]+)/);
        const authorMatch = block.match(/class="a-profile-name"[^>]*>([^<]+)/);
        const dateMatch = block.match(/data-hook="review-date"[^>]*>([^<]+)/) || block.match(/Reviewed[^<]+on\s+([A-Z][a-z]+ \d+, \d{4})/);
        const verifiedMatch = block.match(/data-hook="avp-badge"/);
        if (contentMatch) {
          reviews.push({
            external_id: `amz-${asin}-${reviews.length}`,
            rating: ratingMatch ? parseFloat(ratingMatch[1]) : 3,
            title: titleMatch ? titleMatch[1].trim() : "",
            content: contentMatch[1].trim(),
            author: authorMatch ? authorMatch[1].trim() : "Anonymous",
            date: dateMatch ? new Date(dateMatch[1].includes("on ") ? dateMatch[1].split("on ")[1] : dateMatch[1]) : new Date(),
            verified_purchase: !!verifiedMatch,
          });
        }
      }
      i++;
    }
    return { reviews: deduplicateReviews(reviews), hasMore: false };
  }
}

// ─── Scraper Factory ──────────────────────────────────────
class ScraperFactory { static getScraper(platform: string): Scraper { if (platform === "amazon") return new AmazonScraper(); throw new Error(`Platform ${platform} not supported`); } }

// ─── Analyzer Types ───────────────────────────────────────
type SentimentLabel = "positive" | "neutral" | "negative";
interface AnalyzerReview { external_id: string; rating: number; title: string; content: string; author: string; date: Date; verified_purchase: boolean; }
interface AnalysisReport {
  product_id: string; period: { start: Date; end: Date }; total_reviews: number; avg_rating: number;
  sentiment: { positive: number; negative: number; neutral: number };
  top_complaints: Array<{ complaint: string; frequency: number; examples: string[] }>;
  feature_requests: Array<{ request: string; frequency: number }>;
  swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
}
interface AnalyzerI { analyze(product_id: string, reviews: AnalyzerReview[]): AnalysisReport; }

// ─── Rule-Based Analyzer ──────────────────────────────────
const POSITIVE_WORDS = ["good","great","excellent","love","amazing","perfect","awesome","best","satisfied","happy"];
const NEGATIVE_WORDS = ["bad","poor","horrible","terrible","hate","disappointed","worst","broken","useless","expensive"];
const COMPLAINT_KW = ["broken","not working","fails","unhappy","return","refund","poor quality","slow","difficult","stopped working"];
const FEATURE_KW = ["wish","should have","add","improve","missing","feature","could use","better if"];

class RuleBasedAnalyzer implements AnalyzerI {
  analyze(product_id: string, reviews: AnalyzerReview[]): AnalysisReport {
    if (reviews.length === 0) return this.emptyReport(product_id);
    let pos=0,neu=0,neg=0,totalRating=0;
    const complaints = new Map<string,{frequency:number,examples:string[]}>();
    const features = new Map<string,number>();
    let start=reviews[0].date, end=reviews[0].date;
    for (const r of reviews) {
      totalRating += r.rating;
      if (r.date < start) start = r.date;
      if (r.date > end) end = r.date;
      const c = (r.title + " " + r.content).toLowerCase();
      const s = this.calcSentiment(c, r.rating);
      if (s==="positive") pos++; else if (s==="negative") neg++; else neu++;
      for (const k of COMPLAINT_KW) { if (c.includes(k)) { const e=complaints.get(k)||{frequency:0,examples:[]}; e.frequency++; if(e.examples.length<3) e.examples.push(r.content.slice(0,100)); complaints.set(k,e); } }
      for (const k of FEATURE_KW) { if (c.includes(k)) features.set(k, (features.get(k)||0)+1); }
    }
    const total = reviews.length;
    return {
      product_id, period: {start,end}, total_reviews: total, avg_rating: totalRating/total,
      sentiment: { positive: pos/total, neutral: neu/total, negative: neg/total },
      top_complaints: Array.from(complaints.entries()).sort((a,b)=>b[1].frequency-a[1].frequency).slice(0,5).map(([c,d])=>({complaint:c,...d})),
      feature_requests: Array.from(features.entries()).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([r,f])=>({request:r,frequency:f})),
      swot: { strengths: pos>total/3?["High satisfaction","Positive feedback"]:["Functional product"], weaknesses: neg>total/5?["Reliability concerns","Negative feedback volume"]:["Minor issues"], opportunities: ["Feature expansion","Quality improvements"], threats: ["Competitor pressure","Market changes"] }
    };
  }
  private calcSentiment(c:string, r:number): SentimentLabel { if(r>=4) return "positive"; if(r<=2) return "negative"; let s=0; POSITIVE_WORDS.forEach(w=>{if(c.includes(w)) s++}); NEGATIVE_WORDS.forEach(w=>{if(c.includes(w)) s--}); if(s>0) return "positive"; if(s<0) return "negative"; return "neutral"; }
  private emptyReport(pid:string):AnalysisReport { return {product_id:pid,period:{start:new Date(),end:new Date()},total_reviews:0,avg_rating:0,sentiment:{positive:0,negative:0,neutral:0},top_complaints:[],feature_requests:[],swot:{strengths:[],weaknesses:[],opportunities:[],threats:[]}}; }
}

// ─── Analyzer Factory ─────────────────────────────────────
class AnalyzerFactory { static getAnalyzer(type:string): AnalyzerI { if(type==="rule-based") return new RuleBasedAnalyzer(); throw new Error("Unknown analyzer: "+type); } }

// ─── Main Handler ─────────────────────────────────────────
Deno.serve(async (req: Request) => {
  try {
    const { product_id, analyzer_type = "rule-based" } = await req.json();
    if (!product_id) return new Response(JSON.stringify({error:"product_id required"}),{status:400,headers:{"Content-Type":"application/json"}});

    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const { data: product, error: pErr } = await supabase.from("products").select("*").eq("id", product_id).single();
    if (pErr || !product) throw new Error("Product not found");

    console.log(`Processing: ${product.name} (${product.url})`);
    const scraper = ScraperFactory.getScraper(product.platform);
    const scraped = await scraper.scrape(product.url);
    console.log(`Scraped ${scraped.reviews.length} reviews`);

    if (scraped.reviews.length > 0) {
      const dbReviews = scraped.reviews.map(r => ({ product_id, ...r }));
      await supabase.from("reviews").upsert(dbReviews, { onConflict: "product_id, external_id" });
      await supabase.from("products").update({ last_scraped_at: new Date().toISOString() }).eq("id", product_id);
    }

    const { data: allReviews } = await supabase.from("reviews").select("*").eq("product_id", product_id);
    const analyzer = AnalyzerFactory.getAnalyzer(analyzer_type);
    const reportContent = analyzer.analyze(product_id, allReviews || []);

    const { data: report, error: sErr } = await supabase.from("reports").insert({ product_id, user_id: product.user_id, content: reportContent }).select().single();
    if (sErr) throw sErr;

    return new Response(JSON.stringify({ message:"Pipeline complete", report_id: report.id, reviews_scraped: scraped.reviews.length, total_reviews: allReviews?.length || 0 }), { headers:{"Content-Type":"application/json"} });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status:500, headers:{"Content-Type":"application/json"} });
  }
});
