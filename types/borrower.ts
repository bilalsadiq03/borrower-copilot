export type EmploymentType =
  | "salaried"
  | "self-employed"
  | "informal"

export type LoanPurpose =
  | "personal"
  | "home"
  | "business"
  | "vehicle"
  | "education"
  | "wedding"
  | "medical"
  | "home-improvement"
  | "debt-consolidation"
  | "emergency"
  | "other"

export type LoanType =
  | "personal"
  | "home"
  | "lap"
  | "gold"
  | "two-wheeler"
  | "business"

export interface BorrowerProfile {
  age?: number

  employmentType?: EmploymentType

  monthlyIncome?: number
  incomeMin?: number
  incomeMax?: number

  monthlyExpenses?: number
  existingEMI?: number

  loanType?: LoanType
  loanAmount?: number
  loanPurpose: LoanPurpose

  creditScore?: number
  creditScoreKnown: boolean

  incomeStability?: string

  emergencySavingsMonths?: number

  variableIncomePercent?: number

  existingLoanCount?: number
  recentBounce?: boolean

  collateralValue?: number

  coApplicantIncome?: number

  upcomingExpenses?: number

  productiveLoan?: boolean

  // Adaptive questions
  employmentTenure?: string
  businessTenure?: string
  itrIncome?: number

  hasCollateral?: "yes" | "no" | "unknown"
}
