import type { LoanOffer } from "./types"

export const MOCK_OFFERS: LoanOffer[] = [
  {
    id: "offer-1",
    lenderName: "Lender A",
    loanType: "Personal Loan",
    interestRate: 11.5,
    processingFee: 4999,
    tenureMonths: 60,
    loanAmount: 800000,
    emi: 17599,
    totalRepayment: 1055940,
    totalCost: 255940,
    suitable: true,
    note: "Lower overall interest cost",
  },

  {
    id: "offer-2",
    lenderName: "Lender B",
    loanType: "Personal Loan",
    interestRate: 12.5,
    processingFee: 2999,
    tenureMonths: 60,
    loanAmount: 800000,
    emi: 17999,
    totalRepayment: 1079940,
    totalCost: 279940,
    suitable: true,
    note: "Lower upfront processing fee",
  },

  {
    id: "offer-3",
    lenderName: "Lender C",
    loanType: "Personal Loan",
    interestRate: 14.0,
    processingFee: 1999,
    tenureMonths: 60,
    loanAmount: 800000,
    emi: 18600,
    totalRepayment: 1116000,
    totalCost: 316000,
    suitable: false,
    note: "Higher total borrowing cost",
  },
]