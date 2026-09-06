import type { BorrowerProfile } from "@/types/borrower"

export type QuestionType =
  | "text"
  | "number"
  | "currency"
  | "select"
  | "boolean"

export interface QuestionOption {
  label: string
  value: string
}

export interface Question {
  id: keyof BorrowerProfile | string
  title: string
  description?: string

  type: QuestionType

  required?: boolean

  options?: QuestionOption[]

  placeholder?: string

  /**
   * Determines whether this question should
   * be shown for the current borrower.
   */
  showWhen?: (
    profile: Partial<BorrowerProfile>
  ) => boolean
}