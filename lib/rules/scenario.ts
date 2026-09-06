import type { BorrowerProfile } from "@/types/borrower"

export interface ScenarioAdjustment {
  safeAmountMultiplier: number
  rateAdjustment: number
  riskLevel:
    | "low"
    | "moderate"
    | "high"

  reasons: string[]
}

export function getScenarioAdjustment(
  profile: BorrowerProfile
): ScenarioAdjustment {
  const reasons: string[] = []

  let safeAmountMultiplier = 1
  let rateAdjustment = 0
  let riskLevel:
    | "low"
    | "moderate"
    | "high" = "moderate"

  /*
   * Stable salaried income
   */
  if (
    profile.employmentType === "salaried" &&
    profile.incomeStability === "stable"
  ) {
    safeAmountMultiplier *= 1.05
    riskLevel = "low"

    reasons.push(
      "Stable salaried income supports more predictable repayment capacity."
    )
  }

  /*
   * Self-employed / variable income
   */
  if (
    profile.employmentType === "self-employed"
  ) {
    safeAmountMultiplier *= 0.90
    rateAdjustment += 0.50

    reasons.push(
      "Self-employed income can vary, so the borrower-safe estimate is more conservative."
    )

    if (
      profile.incomeStability ===
      "highly-variable"
    ) {
      safeAmountMultiplier *= 0.90
      rateAdjustment += 0.50

      reasons.push(
        "Highly variable income increases uncertainty around future repayment capacity."
      )
    }
  }

  /*
   * Informal / gig income
   */
  if (
    profile.employmentType === "informal"
  ) {
    safeAmountMultiplier *= 0.80
    rateAdjustment += 1

    reasons.push(
      "Less predictable income calls for a larger repayment buffer."
    )

    if (
      profile.incomeStability ===
      "highly-variable"
    ) {
      safeAmountMultiplier *= 0.90
      rateAdjustment += 0.50
    }
  }

  /*
   * Existing repayment stress
   */
  if (
  (profile.existingEMI ?? 0) >
  (profile.monthlyIncome ?? 0) * 0.40
) {
  safeAmountMultiplier *= 0.70
  riskLevel = "high"

  reasons.push(
    "Existing EMI commitments already consume a significant share of income."
  )
}

  /*
   * Recent repayment issue
   */
  if (profile.recentBounce === true) {
    safeAmountMultiplier *= 0.85
    rateAdjustment += 1

    reasons.push(
      "A recent missed or bounced repayment increases repayment risk."
    )
  }

  /*
   * Emergency savings buffer
   */
  if (
    profile.emergencySavingsMonths !==
      undefined &&
    profile.emergencySavingsMonths >= 6
  ) {
    safeAmountMultiplier *= 1.05

    reasons.push(
      "A stronger emergency savings buffer provides additional resilience."
    )
  }

  if (
    profile.emergencySavingsMonths !==
      undefined &&
    profile.emergencySavingsMonths < 2
  ) {
    safeAmountMultiplier *= 0.85
    riskLevel = "high"

    reasons.push(
      "Limited emergency savings leave less room for unexpected expenses."
    )
  }

  /*
   * Productive loan purpose
   */
  if (
    profile.loanPurpose === "business"
  ) {
    reasons.push(
      "The loan is intended for a potentially income-generating purpose."
    )
  }

  return {
    safeAmountMultiplier,
    rateAdjustment,
    riskLevel,
    reasons,
  }
}