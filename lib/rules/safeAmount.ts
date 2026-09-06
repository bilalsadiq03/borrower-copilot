import { calculateSafeNewEMI } from "@/lib/calculations/affordability"
import { calculateLoanAmount } from "@/lib/calculations/loanAmount"
import { RULES } from "./config"
import type { BorrowerProfile } from "@/types/borrower"

export function calculateBorrowerSafeAmount(
  profile: BorrowerProfile,
  annualRate: number,
  tenureMonths: number
): number {
  if (
    !profile.monthlyIncome ||
    profile.monthlyIncome <= 0
  ) {
    return 0
  }

  const safeEMI =
    calculateSafeNewEMI({
      monthlyIncome: profile.monthlyIncome,
      existingEMI: profile.existingEMI ?? 0,
      maxFOIR: RULES.affordability.defaultBorrowerFOIR,
    })

  return calculateLoanAmount(
    safeEMI,
    annualRate,
    tenureMonths
  )
}