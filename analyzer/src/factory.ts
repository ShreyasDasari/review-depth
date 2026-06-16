import { Analyzer } from "./types.ts";
import { RuleBasedAnalyzer } from "./rule_based.ts";
import { LLMAnalyzer } from "./llm.ts";

export type AnalyzerType = "rule-based" | "llm";

export class AnalyzerFactory {
  static getAnalyzer(type: AnalyzerType, options?: { apiKey: string, model?: string, endpoint?: string }): Analyzer {
    switch (type) {
      case "rule-based":
        return new RuleBasedAnalyzer();
      case "llm":
        if (!options?.apiKey) {
          throw new Error("LLM analyzer requires an API key");
        }
        return new LLMAnalyzer(options);
      default:
        throw new Error(`Unknown analyzer type: ${type}`);
    }
  }
}
