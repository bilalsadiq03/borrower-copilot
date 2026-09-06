import { calculateFOIR } from "./affordability"

export interface StressTestInput {
  monthlyIncome: number
  existingEMI: number
  proposedEMI: number
  incomeDropPercent?: number
  expenseIncrease?: number
}

export interface StressTestResult {
  normalIncome: number
  stressedIncome: number

  normalFOIR: number
  stressedFOIR: number

  normalDisposableIncome: number
  stressedDisposableIncome: number

  incomeDropAmount: number
  expenseIncrease: number

  passes: boolean
}

/**
 * Stress-test a proposed loan against a deterioration
 * in the borrower's financial situation.
 */
export function calculateStressTest({
  monthlyIncome,
  existingEMI,
  proposedEMI,
  incomeDropPercent = 20,
  expenseIncrease = 0,
}: StressTestInput): StressTestResult {
  if (monthlyIncome <= 0) {
    return {
      normalIncome: 0,
      stressedIncome: 0,
      normalFOIR: 0,
      stressedFOIR: 0,
      normalDisposableIncome: 0,
      stressedDisposableIncome: 0,
      incomeDropAmount: 0,
      expenseIncrease: 0,
      passes: false,
    }
  }

  const totalEMI =
    Math.max(0, existingEMI) +
    Math.max(0, proposedEMI)

  const incomeDropAmount =
    monthlyIncome * (incomeDropPercent / 100)

  const stressedIncome =
    Math.max(
      0,
      monthlyIncome - incomeDropAmount
    )

  const normalFOIR =
    calculateFOIR(
      totalEMI,
      monthlyIncome
    )

  const stressedFOIR =
    calculateFOIR(
      totalEMI,
      stressedIncome
    )

  const normalDisposableIncome =
    monthlyIncome - totalEMI

  const stressedDisposableIncome =
    stressedIncome -
    totalEMI -
    Math.max(0, expenseIncrease)

  const passes =
    stressedIncome > 0 &&
    stressedFOIR <= 0.50 &&
    stressedDisposableIncome > 0

  return {
    normalIncome: monthlyIncome,
    stressedIncome,

    normalFOIR,
    stressedFOIR,

    normalDisposableIncome,
    stressedDisposableIncome,

    incomeDropAmount,
    expenseIncrease,

    passes,
  }
}