import type { Question } from "./types"
import type { BorrowerProfile } from "@/types/borrower"

import { MUST_QUESTIONS } from "./question"
import { ADAPTIVE_QUESTIONS } from "./adaptiveQuestions"

export function getQuestions(
  profile: Partial<BorrowerProfile>
): Question[] {
  const adaptive = ADAPTIVE_QUESTIONS.filter(
    (question) =>
      !question.showWhen ||
      question.showWhen(profile)
  )

  return [
    ...MUST_QUESTIONS.filter(
      (question) =>
        !question.showWhen ||
        question.showWhen(profile)
    ),
    ...adaptive,
  ]
}