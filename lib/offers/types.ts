export interface LoanOffer {
  id: string

  lenderName: string

  loanType: string

  interestRate: number

  processingFee: number

  tenureMonths: number

  loanAmount: number

  emi: number

  totalRepayment: number

  totalCost: number

  suitable: boolean

  note?: string
}