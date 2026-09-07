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

function getMissingInputs(
  profile: BorrowerProfile
): string[] {
  const missingInputs: string[] = []

  if (
    profile.monthlyExpenses === undefined
  ) {
    missingInputs.push("monthly household expenses")
  }

  if (
    profile.existingEMI === undefined
  ) {
    missingInputs.push("current EMI commitments")
  }

  if (profile.loanPurpose === undefined) {
    missingInputs.push("loan purpose")
  }

  if (profile.loanAmount === undefined) {
    missingInputs.push("requested loan amount")
  }

  if (profile.loanType === undefined) {
    missingInputs.push("loan type")
  }

  if (profile.age === undefined) {
    missingInputs.push("age")
  }

  if (profile.incomeStability === undefined) {
    missingInputs.push("income stability")
  }

  if (profile.creditScoreKnown === false) {
    missingInputs.push("credit score")
  }

  if (
    profile.creditScoreKnown === true &&
    profile.creditScore === undefined
  ) {
    missingInputs.push("credit score")
  }

  if (
    profile.employmentType === "salaried" &&
    profile.employmentTenure === undefined
  ) {
    missingInputs.push("employment tenure")
  }

  if (
    profile.employmentType === "salaried" &&
    profile.variableIncomePercent === undefined
  ) {
    missingInputs.push("variable income share")
  }

  if (
    profile.employmentType === "self-employed" &&
    profile.businessTenure === undefined
  ) {
    missingInputs.push("business tenure")
  }

  if (
    profile.employmentType === "self-employed" &&
    profile.itrIncome === undefined
  ) {
    missingInputs.push("ITR income")
  }

  if (
    profile.employmentType === "self-employed" &&
    profile.hasCollateral === undefined
  ) {
    missingInputs.push("collateral status")
  }

  if (
    profile.hasCollateral === "yes" &&
    profile.collateralValue === undefined
  ) {
    missingInputs.push("collateral value")
  }

  if (
    profile.employmentType === "informal" &&
    profile.existingLoanCount === undefined
  ) {
    missingInputs.push("existing loan count")
  }

  if (
    profile.employmentType === "informal" &&
    profile.recentBounce === undefined
  ) {
    missingInputs.push("recent EMI bounce history")
  }

  if (
    profile.employmentType === "informal" &&
    profile.emergencySavingsMonths === undefined
  ) {
    missingInputs.push("emergency savings")
  }

  if (
    profile.employmentType === "informal" &&
    profile.productiveLoan === undefined
  ) {
    missingInputs.push("whether the loan increases income")
  }

  return missingInputs
}

function getConfidence(
  missingInputs: string[]
): "high" | "medium" | "low" {
  if (missingInputs.length === 0) {
    return "high"
  }

  if (missingInputs.length <= 2) {
    return "medium"
  }

  return "low"
}

function getRangeFloor(
  confidence:
    | "high"
    | "medium"
    | "low"
): number {
  if (confidence === "high") {
    return 0.9
  }

  if (confidence === "medium") {
    return 0.82
  }

  return 0.72
}

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

  const route =
    getRecommendedProductRoute(profile)

  const effectiveLoanType =
    route === "secured-lap"
      ? "lap"
      : route === "review"
        ? profile.loanType ?? "personal"
        : route

  const rateProfile: BorrowerProfile = {
    ...profile,
    loanType: effectiveLoanType,
  }

  const scenario =
    getScenarioAdjustment(profile)

  const baseRateBand =
    getFairRateBand(rateProfile)

  const adjustedRateBand: AmountRange = {
    min: Math.max(
      0,
      baseRateBand.min +
        scenario.rateAdjustment
    ),
    max: Math.max(
      Math.max(
        0,
        baseRateBand.min +
          scenario.rateAdjustment
      ),
      baseRateBand.max +
        scenario.rateAdjustment
    ),
  }

  const fairRate =
    (adjustedRateBand.min + adjustedRateBand.max) / 2

  const tenure =
    RULES.tenure[effectiveLoanType]

  /*
   * Borrower-safe EMI
   */
  const safeTotalEMI =
    Math.min(
      monthlyIncome *
        RULES.affordability.defaultBorrowerFOIR,
      Math.max(
        0,
        monthlyIncome -
          Math.max(
            0,
            profile.monthlyExpenses ?? 0
          )
      ) *
        RULES.affordability
          .postExpenseBorrowerShare
    )

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
  const missingInputs =
    getMissingInputs(profile)

  const confidence =
    getConfidence(missingInputs)

  const rangeFloor =
    getRangeFloor(confidence)

  const safeAmountRange: AmountRange = {
    min: Math.round(
      safeLoanAmount *
        scenario.safeAmountMultiplier *
        rangeFloor
    ),
    max: Math.round(
      safeLoanAmount *
        scenario.safeAmountMultiplier
    ),
  }

  const lenderAmountRange: AmountRange = {
    min: Math.round(
      lenderLoanAmount * rangeFloor
    ),
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
      monthlyExpenses:
        profile.monthlyExpenses ?? 0,
      existingEMI,
      proposedEMI,
      incomeDropPercent:
        RULES.stress.incomeDropPercent,
    })

  const decision =
    getBorrowDecision({
      profile,
      requestedAmount,
      safeAmount: safeAmountRange.max,
      stressPasses: stress.passes,
      monthlyExpenses:
        profile.monthlyExpenses ?? 0,
    })

  const flags =
    getRiskFlags(profile)

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
      min: Math.round(safeNewEMI * rangeFloor),
      max: Math.round(safeNewEMI),
    },

    requestedEMI: Math.round(proposedEMI),

    fairRate: {
      min: adjustedRateBand.min,
      max: adjustedRateBand.max,
    },

    confidence,

    missingInputs,

    flags,

    scenario: {
      riskLevel: scenario.riskLevel,
      reasons: scenario.reasons,
    },

    profile,
  }
}
