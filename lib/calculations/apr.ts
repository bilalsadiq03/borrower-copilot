import { calculateEMI } from "./emi"

/**
 * Calculate the effective annual rate when upfront fees
 * are deducted from the amount actually received by the borrower.
 *
 * This uses the loan's cash-flow IRR and converts the
 * monthly rate into an annual effective rate.
 *
 * Note:
 * This is an indicative all-in annualized cost estimate,
 * not a regulatory lender APR calculation.
 */

export interface LoanCost {
  emi: number
  totalRepayment: number
  totalInterest: number
  processingFee: number
  totalCost: number
  apr: number
}

export function calculateAPR(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
  processingFeePercent: number = 0,
  upfrontCharges: number = 0
): number {
  if (
    principal <= 0 ||
    tenureMonths <= 0 ||
    annualInterestRate < 0
  ) {
    return 0
  }

  const emi = calculateEMI(
    principal,
    annualInterestRate,
    tenureMonths
  )

  const processingFee =
    principal *
    (processingFeePercent / 100)

  const totalUpfrontFees =
    processingFee +
    Math.max(0, upfrontCharges)

  // Net amount actually received by borrower.
  const netDisbursal =
    principal - totalUpfrontFees

  if (netDisbursal <= 0) {
    return 0
  }

  // Find monthly IRR using binary search.
  let low = 0
  let high = 1

  for (let i = 0; i < 100; i++) {
    const monthlyRate =
      (low + high) / 2

    const pv =
      monthlyRate === 0
        ? emi * tenureMonths
        : emi *
          (
            (1 -
              Math.pow(
                1 + monthlyRate,
                -tenureMonths
              )) /
            monthlyRate
          )

    if (pv > netDisbursal) {
      low = monthlyRate
    } else {
      high = monthlyRate
    }
  }

  const monthlyIRR =
    (low + high) / 2

  // Effective annual rate.
  return (
    Math.pow(
      1 + monthlyIRR,
      12
    ) - 1
  ) * 100
}

export function calculateLoanCost(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
  processingFeePercent: number = 0,
  upfrontCharges: number = 0
): LoanCost {
  const emi = calculateEMI(
    principal,
    annualInterestRate,
    tenureMonths
  )

  const processingFee =
    principal *
    (processingFeePercent / 100)

  const totalRepayment =
    emi * tenureMonths

  const totalInterest =
    totalRepayment - principal

  const totalCost =
    totalInterest +
    processingFee +
    Math.max(
      0,
      upfrontCharges
    )

  const apr = calculateAPR(
    principal,
    annualInterestRate,
    tenureMonths,
    processingFeePercent,
    upfrontCharges
  )

  return {
    emi,
    totalRepayment,
    totalInterest,
    processingFee,
    totalCost,
    apr,
  }
}