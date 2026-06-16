import { Review, Scraper, ScrapingResult } from "./types.ts";

export class ShopifyScraper implements Scraper {
  async scrape(url: string): Promise<ScrapingResult> {
    console.log(`Scraping Shopify URL: ${url}`);
    // This is a stub for future implementation
    // Shopify usually requires theme-specific selectors or API access
    return {
      reviews: [],
      hasMore: false
    };
  }
}
