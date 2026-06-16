# ReviewDepth Analyzer Library

A modular analyzer library for ReviewDepth, designed to process product reviews into actionable intelligence reports.

## Features
- **Sentiment Analysis:** Rule-based sentiment scoring (Positive, Neutral, Negative).
- **Complaint Extraction:** Identifies common issues using keyword-based NLP and calculates frequency.
- **Feature Requests:** Detects user desires and suggested improvements with frequency tracking.
- **SWOT Analysis:** Generates Strengths, Weaknesses, Opportunities, and Threats based on review trends.
- **LLM Support:** Optional LLM-powered analysis for deeper insights (OpenAI-compatible).
- **Deno/TypeScript:** Optimized for Supabase Edge Functions.

## Usage

### Rule-Based Analyzer (No API Key needed)
```typescript
import { AnalyzerFactory } from "./src/factory.ts";

const analyzer = AnalyzerFactory.getAnalyzer("rule-based");
const product_id = "B09JQMJHXY";
const reviews = [
  { 
    external_id: "R1", 
    rating: 5, 
    title: "Great!", 
    content: "I love this product, it works perfectly.",
    author: "User 1",
    date: new Date("2024-01-01"),
    verified_purchase: true
  },
  { 
    external_id: "R2", 
    rating: 2, 
    title: "Broken", 
    content: "The battery dies too fast, I wish it lasted longer.",
    author: "User 2",
    date: new Date("2024-01-05"),
    verified_purchase: true
  }
];

const report = await analyzer.analyze(product_id, reviews);
console.log(report);
```

### LLM Analyzer (Requires OpenAI API Key)
```typescript
const analyzer = AnalyzerFactory.getAnalyzer("llm", {
  apiKey: "your-openai-api-key",
  model: "gpt-4-turbo" // optional
});

const report = await analyzer.analyze(product_id, reviews);
```

## Running Tests
```bash
deno test tests/analyzer_test.ts
```
