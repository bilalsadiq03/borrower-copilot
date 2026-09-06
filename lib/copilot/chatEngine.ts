import type { BorrowerProfile } from "@/types/borrower"
import type { RulesResult } from "@/lib/rules/types"
import type { LoanOffer } from "@/lib/offers/types"

interface ChatContext {
  profile: BorrowerProfile
  result: RulesResult
  offers: LoanOffer[]
}

export function getCopilotResponse(
  question: string,
  context: ChatContext
): string {
  const q = question.toLowerCase()

  const {
    profile,
    result,
    offers,
  } = context

  /*
   * Why borrow less?
   */
  if (
    q.includes("borrow less") ||
    q.includes("less amount") ||
    q.includes("lower amount")
  ) {
    return `I recommended a lower borrowing amount because your borrower-safe range is ₹${Math.round(
      result.safeAmount.min
    ).toLocaleString(
      "en-IN"
    )}–₹${Math.round(
      result.safeAmount.max
    ).toLocaleString(
      "en-IN"
    )}.

Borrowing above this range could put more pressure on your monthly cash flow and reduce your financial buffer.

${result.decisionReason}`
  }

  /*
   * Income drop / stress test
   */
  if (
    q.includes("income drop") ||
    q.includes("income falls") ||
    q.includes("income decrease") ||
    q.includes("20%")
  ) {
    const reducedIncome =
      profile.monthlyIncome ?? 0 * 0.8

    const availableAfterEMI =
      reducedIncome -
      (profile.existingEMI ?? 0)

    return `If your monthly income fell by 20%, it would decrease from ₹${(profile.monthlyIncome ?? 0).toLocaleString(
      "en-IN"
    )} to approximately ₹${reducedIncome.toLocaleString(
      "en-IN"
    )}.

After your existing EMIs of ₹${(profile.existingEMI ?? 0).toLocaleString(
      "en-IN"
    )}, approximately ₹${Math.max(
      0,
      availableAfterEMI
    ).toLocaleString(
      "en-IN"
    )} would remain before other expenses.

That would make the borrowing decision more sensitive to your monthly expenses, so keeping a repayment buffer would be safer.`
  }

  /*
   * Which offer is safer?
   */
  if (
    q.includes("which offer") ||
    q.includes("best offer") ||
    q.includes("safer offer") ||
    q.includes("safe offer")
  ) {
    const suitableOffers =
      offers.filter(
        (offer) => offer.suitable
      )

    if (!suitableOffers.length) {
      return `None of the displayed offers currently falls comfortably within the borrower-safe range.

I would consider reducing the requested amount before comparing lender offers.`
    }

    const best =
      [...suitableOffers].sort(
        (a, b) =>
          a.totalCost -
          b.totalCost
      )[0]

    return `${best.lenderName} currently looks like the better fit among these illustrative offers because its estimated total borrowing cost is ₹${Math.round(
      best.totalCost
    ).toLocaleString(
      "en-IN"
    )}.

However, don't compare on total cost alone. Check the actual lender terms, processing fees, foreclosure conditions and final approved rate before accepting an offer.`
  }

  /*
   * Why this recommendation?
   */
  if (
    q.includes("why") ||
    q.includes("recommend") ||
    q.includes("decision")
  ) {
    return `${result.decisionReason}

Your current scenario is classified as ${result.scenario.riskLevel} risk.

${result.scenario.reasons.join(
  " "
)}`
  }

  /*
   * EMI question
   */
  if (
    q.includes("emi") ||
    q.includes("monthly payment")
  ) {
    return `Based on the current assumptions, your borrower-safe EMI range is approximately ₹${Math.round(
      result.safeEMI.min
    ).toLocaleString(
      "en-IN"
    )}–₹${Math.round(
      result.safeEMI.max
    ).toLocaleString(
      "en-IN"
    )} per month.

The requested loan would have an estimated EMI of approximately ₹${Math.round(
      result.requestedEMI
    ).toLocaleString(
      "en-IN"
    )}.`
  }

  /*
   * Rate question
   */
  if (
    q.includes("rate") ||
    q.includes("interest")
  ) {
    return `Based on the current borrower profile, the indicative fair-rate range is approximately ${result.fairRate.min.toFixed(
      2
    )}%–${result.fairRate.max.toFixed(
      2
    )}%.

This is an estimate for comparison, not a guaranteed lender quote.`
  }

  /*
   * Default
   */
  return `I can help you understand this borrowing decision.

Try asking:

• Why shouldn't I borrow the full amount?
• What happens if my income drops 20%?
• Which offer is safer for me?
• What would my EMI be?
• Why did you recommend this?`
}