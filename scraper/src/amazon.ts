import { DOMParser, Element } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { Review, Scraper, ScrapingResult } from "./types.ts";

export class AmazonScraper implements Scraper {
  private parser: DOMParser;

  constructor() {
    this.parser = new DOMParser();
  }

  async scrape(url: string): Promise<ScrapingResult> {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Amazon page: ${response.statusText}`);
    }

    const html = await response.text();
    const doc = this.parser.parseFromString(html, "text/html");

    if (!doc) {
      throw new Error("Failed to parse HTML");
    }

    // Check for CAPTCHA
    if (html.includes("api-services-support@amazon.com") || html.includes("captcha")) {
      throw new Error("CAPTCHA detected");
    }

    const reviewElements = doc.querySelectorAll('[data-hook="review"]');
    const reviews: Review[] = [];

    reviewElements.forEach((node) => {
      const el = node as Element;
      
      const external_id = el.getAttribute("id") || "";
      const ratingText = el.querySelector('[data-hook="review-star-rating"]')?.textContent || 
                        el.querySelector('.a-icon-star')?.textContent || "";
      const rating = parseFloat(ratingText.split(" ")[0]) || 0;
      
      const title = el.querySelector('[data-hook="review-title"]')?.textContent?.trim() || "";
      const content = el.querySelector('[data-hook="review-body"]')?.textContent?.trim() || "";
      const author = el.querySelector('.a-profile-name')?.textContent?.trim() || "";
      const dateText = el.querySelector('[data-hook="review-date"]')?.textContent?.trim() || "";
      const date = this.parseDate(dateText);
      
      const verified_purchase = !!el.querySelector('[data-hook="avp-badge"]');

      if (external_id && content) {
        reviews.push({
          external_id,
          rating,
          title,
          content,
          author,
          date,
          verified_purchase,
        });
      }
    });

    const nextButton = doc.querySelector("li.a-last a");
    const nextPageUrl = nextButton ? new URL(nextButton.getAttribute("href") || "", url).toString() : undefined;

    return {
      reviews,
      nextPageUrl,
      hasMore: !!nextPageUrl,
    };
  }

  private parseDate(dateText: string): Date {
    // Amazon dates usually look like "Reviewed in the United States on January 1, 2024"
    const match = dateText.match(/on (.+)$/);
    if (match && match[1]) {
      return new Date(match[1]);
    }
    return new Date();
  }
}
