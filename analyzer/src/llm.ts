import { AnalysisReport, Analyzer, Review } from "./types.ts";

export class LLMAnalyzer implements Analyzer {
  private apiKey: string;
  private model: string;
  private endpoint: string;

  constructor(options: { apiKey: string, model?: string, endpoint?: string }) {
    this.apiKey = options.apiKey;
    this.model = options.model || "gpt-3.5-turbo";
    this.endpoint = options.endpoint || "https://api.openai.com/v1/chat/completions";
  }

  async analyze(product_id: string, reviews: Review[]): Promise<AnalysisReport> {
    if (reviews.length === 0) {
      return this.emptyReport(product_id);
    }

    const reviewsText = reviews.map(r => `Rating: ${r.rating}\nTitle: ${r.title}\nContent: ${r.content}`).join("\n\n---\n\n");

    const prompt = `
Analyze the following product reviews and generate a structured intelligence report in JSON format.

Product ID: ${product_id}

Reviews:
${reviewsText}

JSON Output Format:
{
  "sentiment": { "positive": number, "negative": number, "neutral": number },
  "top_complaints": [ { "complaint": string, "frequency": number, "examples": [string] } ],
  "feature_requests": [ { "request": string, "frequency": number } ],
  "swot": { "strengths": [string], "weaknesses": [string], "opportunities": [string], "threats": [string] }
}

Important:
- Sentiment values should be percentages (0-1).
- Include up to 5 complaints and 5 feature requests.
- Provide 2-3 short examples for each complaint.
`;

    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    // Calculate period and rating locally for accuracy
    let startDate = reviews[0].date;
    let endDate = reviews[0].date;
    let totalRating = 0;
    reviews.forEach(r => {
      totalRating += r.rating;
      if (r.date < startDate) startDate = r.date;
      if (r.date > endDate) endDate = r.date;
    });

    return {
      product_id,
      period: { start: startDate, end: endDate },
      total_reviews: reviews.length,
      avg_rating: totalRating / reviews.length,
      ...result,
    };
  }

  private emptyReport(product_id: string): AnalysisReport {
    return {
      product_id,
      period: { start: new Date(), end: new Date() },
      total_reviews: 0,
      avg_rating: 0,
      sentiment: { positive: 0, negative: 0, neutral: 0 },
      top_complaints: [],
      feature_requests: [],
      swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] }
    };
  }
}
