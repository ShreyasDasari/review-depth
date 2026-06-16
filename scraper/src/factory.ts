import { AmazonScraper } from "./amazon.ts";
import { MockScraper } from "./mock.ts";
import { ShopifyScraper } from "./shopify.ts";
import { Scraper } from "./types.ts";

export type Platform = "amazon" | "shopify" | "walmart" | "mock";

export class ScraperFactory {
  static getScraper(platform: Platform): Scraper {
    switch (platform) {
      case "amazon":
        return new AmazonScraper();
      case "shopify":
        return new ShopifyScraper();
      case "mock":
        return new MockScraper();
      default:
        throw new Error(`Platform ${platform} not supported yet`);
    }
  }
}
