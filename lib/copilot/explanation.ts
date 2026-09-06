import type { BorrowerProfile } from "@/types/borrower"
import type { RulesResult } from "@/lib/rules/types"
import type {
  Explanation,
  CopilotRecommendation,
} from "./types"

export function generateCopilotRecommendation(
  profile: BorrowerProfile,
  result: RulesResult
): CopilotRecommendation {
  const explanations: Explanation[] = []
  const actions: string[] = []

  /*
   * Existing debt
   */
  if (
    profile.existingEMI &&
    profile.monthlyIncome
  ) {
    const existingFOIR =
      profile.existingEMI /
      profile.monthlyIncome

    if (existingFOIR >= 0.35) {
      explanations.push({
        title: "Existing debt is already significant",
        message:
          `Your existing EMIs use about ${(existingFOIR * 100).toFixed(1)}% of your monthly income.`,
        severity: "warning",
        relatedInput: "existingEMI",
      })
    }
  }

  /*
   * Stress test
   */
  if (
    result.stressTest.stressedFOIR >
    result.borrowerFOIR
  ) {
    explanations.push({
      title: "Income-drop stress test",
      message:
        `If your income falls by 20%, your estimated debt burden rises to ${(result.stressTest.stressedFOIR * 100).toFixed(1)}%.`,
      severity:
        result.stressTest.passes
          ? "warning"
          : "critical",
      relatedInput: "monthlyIncome",
    })
  }

  /*
   * Recent repayment issue
   */
  if (profile.recentBounce === true) {
    explanations.push({
      title: "Recent repayment issue",
      message:
        "A recent EMI bounce is a warning sign because another loan would increase your monthly obligations.",
      severity: "critical",
      relatedInput: "recentBounce",
    })

    actions.push(
      "Prioritize stabilizing existing repayments before taking another loan."
    )
  }

  /*
   * Unknown credit score
   */
  if (!profile.creditScoreKnown) {
    explanations.push({
      title: "Credit history is unknown",
      message:
        "Your fair-rate estimate is wider because your current credit score is not known.",
      severity: "info",
      relatedInput: "creditScoreKnown",
    })

    actions.push(
      "Check your credit report before accepting an offer."
    )
  }

  /*
   * Emergency savings
   */
  if (
    profile.emergencySavingsMonths !== undefined &&
    profile.emergencySavingsMonths < 2
  ) {
    explanations.push({
      title: "Limited emergency buffer",
      message:
        "Your current savings may provide limited protection against an income shock or unexpected expense.",
      severity: "warning",
      relatedInput: "emergencySavingsMonths",
    })

    actions.push(
      "Keep an emergency buffer before taking on a larger EMI."
    )
  }

  /*
   * Safe amount vs requested amount
   */
  if (
    profile.loanAmount &&
    result.safeAmount.max > 0 &&
    profile.loanAmount >
      result.safeAmount.max
  ) {
    explanations.push({
      title: "Requested amount is above the safe range",
      message:
        "The amount you entered is higher than the amount our affordability rules consider comfortable.",
      severity: "warning",
      relatedInput: "loanAmount",
    })

    actions.push(
      "Consider reducing the loan amount or increasing the down payment."
    )
  }

  /*
   * Product route
   */
  if (
    result.productRoute === "secured-lap"
  ) {
    explanations.push({
      title: "A secured route may be more suitable",
      message:
        "Because collateral is available, a loan-against-property route may offer a better fit than relying only on unsecured borrowing.",
      severity: "info",
      relatedInput: "hasCollateral",
    })

    actions.push(
      "Compare the secured option against an unsecured loan before deciding."
    )
  }

  /*
   * Final headline
   */
  let headline: string
  let summary: string

  switch (result.decision) {
    case "borrow":
      headline = "Borrowing looks manageable"
      summary =
        "The requested borrowing is within the current affordability and stress-test limits."

      break

    case "borrow-less":
      headline = "Consider borrowing less"
      summary =
        "The requested amount is higher than what your current cash flow can comfortably support."

      break

    case "dont-borrow":
      headline = "We recommend waiting"
      summary =
        "Taking on another loan would put too much pressure on your current financial position."

      break
  }

  return {
    decision: result.decision,

    headline,
    summary,

    explanations,

    actions,

    confidence: result.confidence,
  }
}