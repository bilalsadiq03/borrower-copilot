import type { BorrowerProfile } from "@/types/borrower"

import { calculateEMI } from "@/lib/calculations/emi"
import { calculateLoanAmount } from "@/lib/calculations/loanAmount"
import { calculateStressTest } from "@/lib/calculations/stressTest"

import { RULES } from "./config"
import { getFairRateBand } from "./rate"
import { getRiskFlags } from "./risk"
import { getBorrowDecision } from "./decision"
import { getRecommendedProductRoute } from "./productRoute"
import { getScenarioAdjustment } from "./scenario"

import type {
  AmountRange,
  RulesResult,
} from "./types"

export function evaluateBorrower(
  profile: BorrowerProfile
): RulesResult {
  const monthlyIncome =
    profile.monthlyIncome ?? 0

  const existingEMI =
    profile.existingEMI ?? 0

  const requestedAmount =
    profile.loanAmount ?? 0

  if (monthlyIncome <= 0) {
    throw new Error(
      "Monthly income is required to evaluate affordability."
    )
  }

  const rateBand =
    getFairRateBand(profile)

  const fairRate =
    (rateBand.min + rateBand.max) / 2

  const loanType =
    profile.loanType ?? "personal"

  const tenure =
    RULES.tenure[loanType]

  /*
   * Borrower-safe EMI
   */
  const safeTotalEMI =
    monthlyIncome *
    RULES.affordability.defaultBorrowerFOIR

  const safeNewEMI =
    Math.max(
      0,
      safeTotalEMI - existingEMI
    )

  /*
   * Estimated lender EMI capacity
   */
  const lenderTotalEMI =
    monthlyIncome *
    RULES.affordability.defaultLenderFOIR

  const lenderNewEMI =
    Math.max(
      0,
      lenderTotalEMI - existingEMI
    )

  /*
   * Convert EMI capacity into loan amount.
   */
  const safeLoanAmount =
    calculateLoanAmount(
      safeNewEMI,
      fairRate,
      tenure
    )

  const lenderLoanAmount =
    calculateLoanAmount(
      lenderNewEMI,
      fairRate,
      tenure
    )

  /*
   * Use a range instead of pretending we know
   * the exact amount.
   */
  const safeAmountRange: AmountRange = {
    min: Math.round(safeLoanAmount * 0.90),
    max: Math.round(safeLoanAmount),
  }

  const scenario = getScenarioAdjustment(profile)

  const adjustedSafeAmount = {
  min:
    safeAmountRange.min *
    scenario.safeAmountMultiplier,

  max:
    safeAmountRange.max *
    scenario.safeAmountMultiplier,
}

  const lenderAmountRange: AmountRange = {
    min: Math.round(lenderLoanAmount * 0.90),
    max: Math.round(lenderLoanAmount),
  }

  /*
   * EMI for the requested amount.
   */
  const proposedEMI =
    requestedAmount > 0
      ? calculateEMI(
          requestedAmount,
          fairRate,
          tenure
        )
      : 0

  /*
   * Stress test.
   */
  const stress =
    calculateStressTest({
      monthlyIncome,
      existingEMI,
      proposedEMI,
      incomeDropPercent:
        RULES.stress.incomeDropPercent,
    })

  const decision =
    getBorrowDecision({
      profile,
      requestedAmount,
      safeAmount: safeLoanAmount,
      stressPasses: stress.passes,
    })

  const flags =
    getRiskFlags(profile)

  const route =
    getRecommendedProductRoute(profile)

  /*
   * Confidence is deliberately conservative.
   */
  const answeredQuestions =
    Object.values(profile)
      .filter(
        (value) =>
          value !== undefined &&
          value !== null &&
          value !== ""
      )
      .length

  const confidence =
    answeredQuestions >=
    RULES.confidence.minimumAnsweredQuestions
      ? "high"
      : answeredQuestions >= 6
        ? "medium"
        : "low"

  return {
    productRoute: route,

stressTest: {
  normalFOIR: stress.normalFOIR,
  stressedFOIR: stress.stressedFOIR,
  normalDisposableIncome:
    stress.normalDisposableIncome,
  stressedDisposableIncome:
    stress.stressedDisposableIncome,
  passes: stress.passes,
},
    decision: decision.decision,
    decisionReason: decision.reason,

    lenderAmount: lenderAmountRange,
    safeAmount: safeAmountRange,

    lenderFOIR:
      RULES.affordability.defaultLenderFOIR,

    borrowerFOIR:
      RULES.affordability.defaultBorrowerFOIR,

    safeEMI: {
      min: Math.round(safeNewEMI * 0.90),
      max: Math.round(safeNewEMI),
    },

    requestedEMI: Math.round(proposedEMI),

    fairRate: {
      min: rateBand.min,
      max: rateBand.max,
    },

    confidence,

    flags,

    scenario: {
      riskLevel: scenario.riskLevel,
      reasons: scenario.reasons,
    },

    profile,
  }
}