import type { BorrowerProfile } from "@/types/borrower"
import type { RulesResult } from "@/lib/rules/types"
import type { LoanOffer } from "@/lib/offers/types"

export type CopilotRole =
  | "user"
  | "assistant"

export interface CopilotMessage {
  id: string
  role: CopilotRole
  content: string
}

export interface CopilotContext {
  profile: BorrowerProfile
  result: RulesResult
  offers: LoanOffer[]
}