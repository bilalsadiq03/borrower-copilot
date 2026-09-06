/**
 * Calculate monthly EMI for a loan.
 *
 * @param principal Loan amount in rupees
 * @param annualRate Annual interest rate as percentage
 * @param tenureMonths Loan tenure in months
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  if (principal <= 0 || tenureMonths <= 0) {
    return 0
  }

  // Zero-interest case
  if (annualRate === 0) {
    return principal / tenureMonths
  }

  const monthlyRate = annualRate / 100 / 12

  const factor = Math.pow(1 + monthlyRate, tenureMonths)

  return (
    principal *
    (monthlyRate * factor) /
    (factor - 1)
  )
}