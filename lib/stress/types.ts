export interface StressScenario {
  incomeChangePercent: number
  expenseChangePercent: number
  rateChangePercent: number
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

  monthlyIncome: number
  monthlyExpenses: number
  existingEMI: number

  availableIncome: number
  foir: number

  estimatedEMI: number

  safe: boolean

  message: string
}
