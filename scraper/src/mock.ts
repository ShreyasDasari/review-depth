import { Review, Scraper, ScrapingResult } from "./types.ts";

export class MockScraper implements Scraper {
  async scrape(_url: string): Promise<ScrapingResult> {
    const reviews: Review[] = [
      {
        external_id: "R123",
        rating: 5,
        title: "Great product",
        content: "I love these AirPods! The noise cancellation is amazing.",
        author: "John Doe",
        date: new Date("2024-01-01"),
        verified_purchase: true,
      },
      {
        external_id: "R456",
        rating: 4,
        title: "Good but expensive",
        content: "The sound quality is top-notch, but the price tag is heavy.",
        author: "Jane Smith",
        date: new Date("2024-01-05"),
        verified_purchase: true,
      },
    ];

    return {
      reviews,
      hasMore: false,
    };
  }
}
