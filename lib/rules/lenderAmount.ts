import { calculateSafeNewEMI } from "@/lib/calculations/affordability"
import { calculateLoanAmount } from "@/lib/calculations/loanAmount"
import { RULES } from "./config"
import type { BorrowerProfile } from "@/types/borrower"

export function calculateLenderAmount(
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

  const existingEMI =
    profile.existingEMI ?? 0

  const safeEMI =
    calculateSafeNewEMI({
      monthlyIncome: profile.monthlyIncome,
      existingEMI,
      maxFOIR: RULES.affordability.defaultLenderFOIR,
    })

  return calculateLoanAmount(
    safeEMI,
    annualRate,
    tenureMonths
  )
}