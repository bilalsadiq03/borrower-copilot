import type { BorrowerProfile } from "@/types/borrower"
import type { BorrowDecision } from "./types"

interface DecisionInput {
  profile: BorrowerProfile
  requestedAmount: number
  safeAmount: number
  stressPasses: boolean
  monthlyExpenses?: number
}

export function getBorrowDecision({
  profile,
  requestedAmount,
  safeAmount,
  stressPasses,
  monthlyExpenses = 0,
}: DecisionInput): {
  decision: BorrowDecision
  reason: string
} {
  const recentBounce =
    profile.recentBounce === true

  const existingEMI =
    profile.existingEMI ?? 0

  const income =
    profile.monthlyIncome ?? 0

  const currentFOIR =
    income > 0
      ? existingEMI / income
      : 1

  const postExpenseBuffer =
    income -
    Math.max(0, monthlyExpenses) -
    existingEMI

  const postExpenseBufferRatio =
    income > 0
      ? postExpenseBuffer / income
      : 0

  // Hard stop: current debt burden already too high
  if (currentFOIR >= 0.50) {
    return {
      decision: "dont-borrow",
      reason:
        "Your existing loan payments already consume a large share of your income.",
    }
  }

  if (postExpenseBufferRatio <= 0.2) {
    return {
      decision: "dont-borrow",
      reason:
        "Household expenses and current EMIs leave too little monthly buffer for another loan.",
    }
  }

  // Recent repayment problem + weak resilience
  if (
    recentBounce &&
    (profile.emergencySavingsMonths ?? 0) < 1
  ) {
    return {
      decision: "dont-borrow",
      reason:
        "A recent EMI bounce combined with limited emergency savings makes taking on another loan risky.",
    }
  }

  // Requested amount materially exceeds safe capacity
  if (
    safeAmount > 0 &&
    requestedAmount > safeAmount * 1.25
  ) {
    return {
      decision: "borrow-less",
      reason:
        "The amount you want is materially above the amount your current cash flow can safely support.",
    }
  }

  // Stress scenario fails
  if (!stressPasses) {
    return {
      decision: "borrow-less",
      reason:
        "The proposed EMI becomes difficult to sustain under the stress scenario.",
    }
  }

  return {
    decision: "borrow",
    reason:
      "The requested loan fits within the current affordability and stress-test limits.",
  }
}
