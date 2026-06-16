import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { MockScraper } from "../src/mock.ts";
import { AmazonScraper } from "../src/amazon.ts";
import { deduplicateReviews } from "../src/types.ts";

Deno.test("deduplicateReviews removes duplicates", () => {
  const reviews = [
    { external_id: "1", rating: 5, content: "A", author: "A", date: new Date(), verified_purchase: true, title: "T" },
    { external_id: "1", rating: 5, content: "A", author: "A", date: new Date(), verified_purchase: true, title: "T" },
    { external_id: "2", rating: 4, content: "B", author: "B", date: new Date(), verified_purchase: true, title: "T" },
  ];
  const result = deduplicateReviews(reviews);
  assertEquals(result.length, 2);
  assertEquals(result[0].external_id, "1");
  assertEquals(result[1].external_id, "2");
});

Deno.test("MockScraper returns valid reviews", async () => {
  const scraper = new MockScraper();
  const result = await scraper.scrape("https://example.com");
  
  assertEquals(result.reviews.length, 2);
  assertEquals(result.reviews[0].external_id, "R123");
  assertEquals(result.reviews[0].rating, 5);
});

Deno.test("AmazonScraper handles CAPTCHA gracefully", async () => {
  const scraper = new AmazonScraper();
  // We can't easily test real scraping without a live URL and potentially getting blocked,
  // but we can mock the fetch response if needed.
  // For now, this is a placeholder to show the intent.
});

Deno.test("AmazonScraper date parsing", () => {
  const scraper = new AmazonScraper();
  // Accessing private method for testing (casting to any)
  const dateText = "Reviewed in the United States on January 1, 2024";
  const date = (scraper as any).parseDate(dateText);
  
  assertEquals(date.getFullYear(), 2024);
  assertEquals(date.getMonth(), 0); // January is 0
  assertEquals(date.getDate(), 1);
});
