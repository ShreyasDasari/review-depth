import { AnalysisReport, Analyzer, Review, SentimentLabel } from "./types.ts";

const POSITIVE_WORDS = ["good", "great", "excellent", "love", "amazing", "perfect", "awesome", "best", "satisfied", "happy"];
const NEGATIVE_WORDS = ["bad", "poor", "horrible", "terrible", "hate", "disappointed", "worst", "broken", "useless", "expensive"];
const COMPLAINT_KEYWORDS = ["broken", "not working", "fails", "unhappy", "return", "refund", "poor quality", "slow", "difficult", "stopped working"];
const FEATURE_KEYWORDS = ["wish", "should have", "add", "improve", "missing", "feature", "could use", "better if"];

export class RuleBasedAnalyzer implements Analyzer {
  analyze(product_id: string, reviews: Review[]): AnalysisReport {
    if (reviews.length === 0) {
      return this.emptyReport(product_id);
    }

    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;
    let totalRating = 0;
    
    const complaintsMap = new Map<string, { frequency: number, examples: string[] }>();
    const featuresMap = new Map<string, number>();

    let startDate = reviews[0].date;
    let endDate = reviews[0].date;

    reviews.forEach((review) => {
      totalRating += review.rating;
      if (review.date < startDate) startDate = review.date;
      if (review.date > endDate) endDate = review.date;

      const content = (review.title + " " + review.content).toLowerCase();
      const sentiment = this.calculateSentiment(content, review.rating);
      
      if (sentiment === "positive") positiveCount++;
      else if (sentiment === "negative") negativeCount++;
      else neutralCount++;

      this.extractComplaints(content).forEach(c => {
        const existing = complaintsMap.get(c) || { frequency: 0, examples: [] };
        existing.frequency++;
        if (existing.examples.length < 3) existing.examples.push(review.content.slice(0, 100) + "...");
        complaintsMap.set(c, existing);
      });

      this.extractFeatures(content).forEach(f => {
        featuresMap.set(f, (featuresMap.get(f) || 0) + 1);
      });
    });

    const total = reviews.length;

    const topComplaints = Array.from(complaintsMap.entries())
      .sort((a, b) => b[1].frequency - a[1].frequency)
      .slice(0, 5)
      .map(([complaint, data]) => ({ complaint, ...data }));

    const featureRequests = Array.from(featuresMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([request, frequency]) => ({ request, frequency }));

    return {
      product_id,
      period: { start: startDate, end: endDate },
      total_reviews: total,
      avg_rating: totalRating / total,
      sentiment: {
        positive: positiveCount / total,
        neutral: neutralCount / total,
        negative: negativeCount / total,
      },
      top_complaints: topComplaints,
      feature_requests: featureRequests,
      swot: {
        strengths: positiveCount > total / 3 ? ["High customer satisfaction", "Positive brand perception"] : ["Core functionality meets expectations"],
        weaknesses: negativeCount > total / 5 ? ["Significant volume of negative feedback", "Reliability concerns"] : ["Minor usability issues"],
        opportunities: featureRequests.length > 0 ? ["Implement requested features: " + featureRequests[0].request] : ["Gather more user feedback"],
        threats: topComplaints.length > 0 ? ["Customer churn due to: " + topComplaints[0].complaint] : ["Competitive landscape shifts"],
      }
    };
  }

  private calculateSentiment(content: string, rating: number): SentimentLabel {
    if (rating >= 4) return "positive";
    if (rating <= 2) return "negative";

    let score = 0;
    POSITIVE_WORDS.forEach(w => { if (content.includes(w)) score++; });
    NEGATIVE_WORDS.forEach(w => { if (content.includes(w)) score--; });

    if (score > 0) return "positive";
    if (score < 0) return "negative";
    return "neutral";
  }

  private extractComplaints(content: string): string[] {
    const complaints: string[] = [];
    COMPLAINT_KEYWORDS.forEach(k => {
      if (content.includes(k)) {
        complaints.push(k);
      }
    });
    return complaints;
  }

  private extractFeatures(content: string): string[] {
    const features: string[] = [];
    FEATURE_KEYWORDS.forEach(k => {
      if (content.includes(k)) {
        features.push(k);
      }
    });
    return features;
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
