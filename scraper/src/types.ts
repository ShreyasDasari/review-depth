export interface Review {
  external_id: string;
  rating: number;
  title: string;
  content: string;
  author: string;
  date: Date;
  verified_purchase: boolean;
}

export interface ScrapingResult {
  reviews: Review[];
  nextPageUrl?: string;
  hasMore: boolean;
}

export interface Scraper {
  scrape(url: string): Promise<ScrapingResult>;
}

export function deduplicateReviews(reviews: Review[]): Review[] {
  const seen = new Set<string>();
  return reviews.filter((review) => {
    if (seen.has(review.external_id)) {
      return false;
    }
    seen.add(review.external_id);
    return true;
  });
}
