import { assertEquals, assertExists } from "https://deno.land/std/assert/mod.ts";
import { RuleBasedAnalyzer } from "../src/rule_based.ts";
import { Review } from "../src/types.ts";

const mockReviews: Review[] = [
  {
    external_id: "1",
    rating: 5,
    title: "Great!",
    content: "I love this product, it works perfectly.",
    author: "User 1",
    date: new Date("2024-01-01"),
    verified_purchase: true,
  },
  {
    external_id: "2",
    rating: 1,
    title: "Broken",
    content: "It arrived broken and stopped working after a day. Terrible quality.",
    author: "User 2",
    date: new Date("2024-01-05"),
    verified_purchase: true,
  },
  {
    external_id: "3",
    rating: 4,
    title: "Good but could be better",
    content: "I wish it had a better battery life. Overall good.",
    author: "User 3",
    date: new Date("2024-01-10"),
    verified_purchase: true,
  }
];

Deno.test("RuleBasedAnalyzer - Report Structure", () => {
  const analyzer = new RuleBasedAnalyzer();
  const report = analyzer.analyze("test-product", mockReviews);

  assertEquals(report.product_id, "test-product");
  assertEquals(report.total_reviews, 3);
  assertEquals(report.sentiment.positive, 2/3);
  assertEquals(report.sentiment.negative, 1/3);
  assertEquals(report.sentiment.neutral, 0);
  
  assertExists(report.top_complaints.find(c => c.complaint === "broken"));
  assertExists(report.feature_requests.find(f => f.request === "wish"));
  
  assertExists(report.swot.strengths);
  assertExists(report.swot.weaknesses);
});

Deno.test("RuleBasedAnalyzer - Date Period", () => {
  const analyzer = new RuleBasedAnalyzer();
  const report = analyzer.analyze("test-product", mockReviews);

  assertEquals(report.period.start.toISOString().split('T')[0], "2024-01-01");
  assertEquals(report.period.end.toISOString().split('T')[0], "2024-01-10");
});
