import { RULES } from "./config"
import type { BorrowerProfile } from "@/types/borrower"

export function getFairRateBand(
  profile: BorrowerProfile
): { min: number; max: number } {
  const loanType = profile.loanType

  if (!loanType) {
    return {
      min: 12,
      max: 18,
    }
  }

  const base = RULES.rates[loanType]

  if (!base) {
    return {
      min: 12,
      max: 18,
    }
  }

  let min = base.min
  let max = base.max

  // Strong known credit profile
  if (
    profile.creditScoreKnown &&
    profile.creditScore &&
    profile.creditScore >= 750
  ) {
    min -= 1
    max -= 1
  }

  // Unknown credit history means wider uncertainty
  if (
    !profile.creditScoreKnown
  ) {
    min -= 0.5
    max += 1.5
  }

  // Highly variable income increases risk
  if (
    profile.incomeStability === "highly-variable"
  ) {
    min += 1
    max += 2
  }

  return {
    min: Math.max(0, min),
    max,
  }
}