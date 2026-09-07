import { calculateAPR } from "@/lib/calculations/apr"
import { calculateEMI } from "@/lib/calculations/emi"
import type { BorrowerProfile } from "@/types/borrower"

import { RULES } from "./config"
import type { RulesResult } from "./types"
import type { CopilotRecommendation } from "@/lib/copilot/types"

export interface NegotiationCardData {
  requestedAmount: number
  safeAmount: {
    min: number
    max: number
  }
  lenderAmount: {
    min: number
    max: number
  }
  fairRate: {
    min: number
    max: number
  }
  apr: {
    min: number
    max: number
  }
  processingFeePercent: number
  safeEMI: {
    min: number
    max: number
  }
  recommendedTenureMonths: number
  longerTenureMonths: number
  recommendedEMI: number
  longerEMI: number
  confidence: RulesResult["confidence"]
  missingInputs: string[]
  routeLabel: string
  routeReason: string
  reasons: string[]
  negotiationQuestions: string[]
  disclaimer: string
}

function getEffectiveLoanType(
  profile: BorrowerProfile,
  result: RulesResult
): keyof typeof RULES.tenure {
  if (result.productRoute === "secured-lap") {
    return "lap"
  }

  if (
    result.productRoute !== "review"
  ) {
    return result.productRoute as keyof typeof RULES.tenure
  }

  return (
    profile.loanType ?? "personal"
  )
}

function getRouteLabel(
  result: RulesResult,
  profile: BorrowerProfile
): string {
  if (result.productRoute === "secured-lap") {
    return "Secured LAP route"
  }

  if (result.productRoute === "business") {
    return "Business route"
  }

  if (result.productRoute === "two-wheeler") {
    return "Two-wheeler route"
  }

  if (result.productRoute === "home") {
    return "Home loan route"
  }

  if (result.productRoute === "gold") {
    return "Gold loan route"
  }

  if (result.productRoute === "personal") {
    return "Personal loan route"
  }

  if (profile.loanType) {
    return `${profile.loanType} route`
  }

  return "Review needed"
}

function getRouteReason(
  result: RulesResult,
  profile: BorrowerProfile
): string {
  if (result.productRoute === "secured-lap") {
    return "Collateral is available, so a secured loan-against-property style route is more relevant than an unsecured personal loan."
  }

  if (result.productRoute === "two-wheeler") {
    return "The scooter purpose fits a two-wheeler route, but repayment risk is still high because existing EMI commitments are already heavy."
  }

  if (result.productRoute === "business") {
    return "The business route fits a productive-purpose loan better than an unsecured personal loan."
  }

  if (profile.employmentType === "informal") {
    return "Informal income means a lender will usually look harder at repayment stability and the purpose of the loan."
  }

  if (profile.employmentType === "self-employed") {
    return "Self-employed income and business cash flow usually push the review toward business or secured lending."
  }

  return "The route follows the loan type and the affordability profile you provided."
}

export function buildNegotiationCardData(
  profile: BorrowerProfile,
  result: RulesResult,
  recommendation: CopilotRecommendation
): NegotiationCardData {
  const effectiveLoanType =
    getEffectiveLoanType(profile, result)

  const principal =
    profile.loanAmount ??
    result.safeAmount.max ??
    result.lenderAmount.max ??
    0

  const tenureMonths =
    RULES.tenure[effectiveLoanType]

  const longerTenureMonths =
    tenureMonths + 24

  const fairRateMidpoint =
    (result.fairRate.min +
      result.fairRate.max) /
    2

  const processingFeePercent =
    RULES.fees[effectiveLoanType]

  const aprMin = calculateAPR(
    principal,
    result.fairRate.min,
    tenureMonths,
    processingFeePercent,
    0
  )

  const aprMax = calculateAPR(
    principal,
    result.fairRate.max,
    tenureMonths,
    processingFeePercent,
    0
  )

  const recommendedEMI = calculateEMI(
    principal,
    fairRateMidpoint,
    tenureMonths
  )

  const longerEMI = calculateEMI(
    principal,
    fairRateMidpoint,
    longerTenureMonths
  )

  const negotiationQuestions = [
    "What is the all-in APR including processing fees?",
    "What is the processing fee and are there other upfront charges?",
    "What total repayment should I expect over the full tenure?",
    "Can you quote the same structure on a secured or longer-tenure option?",
  ]

  return {
    requestedAmount:
      profile.loanAmount ?? 0,
    safeAmount: result.safeAmount,
    lenderAmount: result.lenderAmount,
    fairRate: result.fairRate,
    apr: {
      min: aprMin,
      max: aprMax,
    },
    processingFeePercent,
    safeEMI: result.safeEMI,
    recommendedTenureMonths: tenureMonths,
    longerTenureMonths,
    recommendedEMI,
    longerEMI,
    confidence: result.confidence,
    missingInputs: result.missingInputs,
    routeLabel: getRouteLabel(
      result,
      profile
    ),
    routeReason: getRouteReason(
      result,
      profile
    ),
    reasons: [
      result.decisionReason,
      getRouteReason(result, profile),
    ],
    negotiationQuestions,
    disclaimer:
      "Self-assessment based on the information provided. Not a lender approval.",
  }
}
