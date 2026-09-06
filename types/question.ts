export type QuestionType =
  | "number"
  | "currency"
  | "currency-range"
  | "select"
  | "radio"
  | "boolean"

export interface QuestionOption {
  label: string
  value: string
}

export interface Question {
  id: string
  title: string
  description?: string
  type: QuestionType

  required?: boolean

  options?: QuestionOption[]

  min?: number
  max?: number
  step?: number

  showWhen?: (
    answers: Record<string, unknown>
  ) => boolean
}