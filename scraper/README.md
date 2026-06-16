# ReviewDepth Scraper Library

A modular scraping library for ReviewDepth, designed to work in Deno/Supabase Edge Functions.

## Features
- **Amazon Support:** Scrapes reviews using stable `data-hook` selectors.
- **Pagination:** Returns `nextPageUrl` and `hasMore` status.
- **Mocking:** Includes a `MockScraper` for testing without network calls.
- **TypeScript/Deno:** Built for modern runtimes.

## Usage

```typescript
import { ScraperFactory } from "./src/factory.ts";

const scraper = ScraperFactory.getScraper("amazon");
const result = await scraper.scrape("https://www.amazon.com/product-reviews/ASIN");

console.log(result.reviews);
```

## Running Tests
```bash
deno test --allow-net tests/scraper_test.ts
```

## Future Platforms
To add support for other platforms (e.g., Shopify, Walmart):
1. Create a new class implementing the `Scraper` interface in `src/`.
2. Update `ScraperFactory` in `src/factory.ts`.
