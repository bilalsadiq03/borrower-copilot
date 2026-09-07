export interface LoanOffer {
  id: string

  lenderName: string

  loanType: string

  interestRate: number

  /**
   * Indicative all-in annualized cost,
   * including upfront processing fees.
   */
  apr: number

  processingFee: number

  tenureMonths: number

  loanAmount: number

  emi: number

  totalRepayment: number

  totalCost: number

  suitable: boolean

  note?: string
}