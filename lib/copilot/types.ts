import type { BorrowDecision } from "@/lib/rules/types"

export type ExplanationSeverity =
  | "info"
  | "warning"
  | "critical"

export interface Explanation {
  title: string
  message: string
  severity: ExplanationSeverity

  relatedInput?: string

  rule?: {
    name: string
    value: string
  }
}

export interface CopilotRecommendation {
  decision: BorrowDecision

  headline: string
  summary: string

  explanations: Explanation[]

  actions: string[]

  confidence: "high" | "medium" | "low"
}