export interface AffordabilityInput {
  monthlyIncome: number
  existingEMI: number
  maxFOIR: number
}

/**
 * Calculate the maximum total EMI a borrower should carry.
 *
 * maxFOIR is expressed as a decimal.
 * Example: 45% = 0.45
 */
export function calculateMaximumTotalEMI({
  monthlyIncome,
  maxFOIR,
}: Omit<AffordabilityInput, "existingEMI">): number {
  if (monthlyIncome <= 0 || maxFOIR <= 0) {
    return 0
  }

  return monthlyIncome * maxFOIR
}

/**
 * Calculate the maximum additional EMI available
 * after accounting for existing loan obligations.
 */
export function calculateSafeNewEMI({
  monthlyIncome,
  existingEMI,
  maxFOIR,
}: AffordabilityInput): number {
  if (monthlyIncome <= 0 || maxFOIR <= 0) {
    return 0
  }

  const maximumTotalEMI =
    calculateMaximumTotalEMI({
      monthlyIncome,
      maxFOIR,
    })

  return Math.max(
    0,
    maximumTotalEMI - Math.max(0, existingEMI)
  )
}

export function calculateFOIR(
  totalEMI: number,
  monthlyIncome: number
): number {
  if (monthlyIncome <= 0) {
    return 0
  }

  return totalEMI / monthlyIncome
}