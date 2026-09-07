import type { BorrowerProfile } from "@/types/borrower"
import type { ProductRoute } from "./productRoute"


export interface AmountRange {
  min: number
  max: number
}

export type BorrowDecision =
  | "borrow"
  | "borrow-less"
  | "dont-borrow"

  export interface ScenarioResult {
  riskLevel:
    | "low"
    | "moderate"
    | "high"

  reasons: string[]
}

export interface RulesResult {
  decision: BorrowDecision
  decisionReason: string

  lenderAmount: AmountRange
  safeAmount: AmountRange

  lenderFOIR: number
  borrowerFOIR: number
  scenario: ScenarioResult

  safeEMI: AmountRange
  requestedEMI: number

  fairRate: AmountRange

  confidence:
    | "high"
    | "medium"
    | "low"

  missingInputs: string[]

  flags: string[]

  productRoute: ProductRoute

  stressTest: {
    normalFOIR: number
    stressedFOIR: number
    normalDisposableIncome: number
    stressedDisposableIncome: number
    passes: boolean
  }

  profile: BorrowerProfile
}
