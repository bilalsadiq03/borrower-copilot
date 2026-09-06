export interface StressScenario {
  incomeChangePercent: number
  expenseChangePercent: number
  rateChangePercent: number
}

export interface StressTestResult {
  monthlyIncome: number
  monthlyExpenses: number
  existingEMI: number

  availableIncome: number
  foir: number

  estimatedEMI: number

  safe: boolean

  message: string
}