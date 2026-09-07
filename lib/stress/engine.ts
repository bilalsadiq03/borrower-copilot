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
  const baseMonthlyIncome =
    profile.monthlyIncome ?? 0

  const monthlyIncome =
    baseMonthlyIncome *
    (1 + scenario.incomeChangePercent / 100)

  const baseMonthlyExpenses =
    profile.monthlyExpenses ?? 0

  const monthlyExpenses =
    baseMonthlyExpenses *
    (1 + scenario.expenseChangePercent / 100)

  const existingEMI =
    profile.existingEMI ?? 0

  const loanAmount =
    profile.loanAmount ?? 0

  const rate =
    result.fairRate.min *
    (1 + scenario.rateChangePercent / 100)

  const normalEstimatedEMI =
    calculateEMI(
      loanAmount,
      result.fairRate.min,
      60
    )

  const estimatedEMI =
    calculateEMI(
      loanAmount,
      rate,
      60
    )

  const totalEMI =
    existingEMI +
    estimatedEMI

  const normalTotalEMI =
    existingEMI +
    normalEstimatedEMI

  const foir =
    monthlyIncome > 0
      ? totalEMI / monthlyIncome
      : 1

  const normalFOIR =
    baseMonthlyIncome > 0
      ? normalTotalEMI /
        baseMonthlyIncome
      : 0

  const availableIncome =
    monthlyIncome -
    monthlyExpenses -
    totalEMI

  const normalDisposableIncome =
    baseMonthlyIncome -
    baseMonthlyExpenses -
    normalTotalEMI

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
    normalIncome:
      baseMonthlyIncome,
    stressedIncome:
      monthlyIncome,

    normalFOIR,
    stressedFOIR:
      foir,

    normalDisposableIncome,
    stressedDisposableIncome:
      availableIncome,

    incomeDropAmount:
      baseMonthlyIncome -
      monthlyIncome,
    expenseIncrease:
      monthlyExpenses -
      baseMonthlyExpenses,

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
