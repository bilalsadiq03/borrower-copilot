import type { BorrowerProfile } from "@/types/borrower"
import type { RulesResult } from "@/lib/rules/types"
import type {
  StressScenario,
  StressTestResult,
} from "./types"

import { calculateEMI } from "@/lib/calculations/emi"

export function runStressTest(
  profile: BorrowerProfile,
  result: RulesResult,
  scenario: StressScenario
): StressTestResult {
  const monthlyIncome =
    profile.monthlyIncome ?? 0 *
    (1 + scenario.incomeChangePercent / 100)

  const monthlyExpenses =
    profile.monthlyExpenses ?? 0 *
    (1 + scenario.expenseChangePercent / 100)

  const existingEMI =
    profile.existingEMI ?? 0

  const rate =
    result.fairRate.min *
    (1 + scenario.rateChangePercent / 100)

  const estimatedEMI =
    calculateEMI(
      profile.loanAmount,
      rate,
      60
    )

  const totalEMI =
    existingEMI +
    estimatedEMI

  const foir =
    monthlyIncome > 0
      ? totalEMI / monthlyIncome
      : 1

  const availableIncome =
    monthlyIncome -
    monthlyExpenses -
    totalEMI

  const safe =
    foir <= 0.50 &&
    availableIncome > 0

  let message: string

  if (safe) {
    message =
      "The borrowing still appears manageable under this scenario, although your financial buffer would be lower."
  } else {
    message =
      "This scenario would put significant pressure on your repayment capacity. Consider reducing the loan amount or building a larger financial buffer."
  }

  return {
    monthlyIncome,
    monthlyExpenses,
    existingEMI,
    availableIncome,
    foir,
    estimatedEMI,
    safe,
    message,
  }
}