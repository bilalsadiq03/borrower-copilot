import { calculateEMI } from "@/lib/calculations/emi"
import { calculateAPR } from "@/lib/calculations/apr"

import type { LoanOffer } from "./types"

const BASE_LOAN_AMOUNT = 800000
const TENURE_MONTHS = 60

function buildMockOffer({
  id,
  lenderName,
  loanType,
  interestRate,
  processingFee,
  suitable,
  note,
}: {
  id: string
  lenderName: string
  loanType: string
  interestRate: number
  processingFee: number
  suitable: boolean
  note: string
}): LoanOffer {
  const emi = calculateEMI(
    BASE_LOAN_AMOUNT,
    interestRate,
    TENURE_MONTHS
  )

  const totalRepayment = emi * TENURE_MONTHS
  const totalCost =
    totalRepayment -
    BASE_LOAN_AMOUNT +
    processingFee

  return {
    id,
    lenderName,
    loanType,
    interestRate,
    apr: calculateAPR(
      BASE_LOAN_AMOUNT,
      interestRate,
      TENURE_MONTHS,
      0,
      processingFee
    ),
    processingFee,
    tenureMonths: TENURE_MONTHS,
    loanAmount: BASE_LOAN_AMOUNT,
    emi,
    totalRepayment,
    totalCost,
    suitable,
    note,
  }
}

export const MOCK_OFFERS: LoanOffer[] = [
  buildMockOffer({
    id: "offer-1",
    lenderName: "Lender A",
    loanType: "Personal Loan",
    interestRate: 11.5,
    processingFee: 4999,
    suitable: true,
    note: "Lower overall interest cost",
  }),
  buildMockOffer({
    id: "offer-2",
    lenderName: "Lender B",
    loanType: "Personal Loan",
    interestRate: 12.5,
    processingFee: 2999,
    suitable: true,
    note: "Lower upfront processing fee",
  }),
  buildMockOffer({
    id: "offer-3",
    lenderName: "Lender C",
    loanType: "Personal Loan",
    interestRate: 14.0,
    processingFee: 1999,
    suitable: false,
    note: "Higher total borrowing cost",
  }),
]
