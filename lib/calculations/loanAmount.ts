/**
 * Calculate the loan principal supported by a given EMI.
 *
 * @param emi Maximum affordable monthly EMI
 * @param annualRate Annual interest rate as percentage
 * @param tenureMonths Loan tenure in months
 */
export function calculateLoanAmount(
  emi: number,
  annualRate: number,
  tenureMonths: number
): number {
  if (emi <= 0 || tenureMonths <= 0) {
    return 0
  }

  if (annualRate === 0) {
    return emi * tenureMonths
  }

  const monthlyRate = annualRate / 100 / 12

  const factor = Math.pow(1 + monthlyRate, tenureMonths)

  return (
    emi *
    (factor - 1) /
    (monthlyRate * factor)
  )
}