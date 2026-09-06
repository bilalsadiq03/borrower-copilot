import { Question } from "@/types/question"
import { mustQuestions } from "./questions"
import { adaptiveQuestions } from "./adaptiveQuestions"

export function getVisibleQuestions(
  answers: Record<string, unknown>
): Question[] {
  const allQuestions: Question[] = [
    ...mustQuestions,
    ...adaptiveQuestions,
  ]

  return allQuestions.filter((question) => {
    if (!question.showWhen) {
      return true
    }

    return question.showWhen(answers)
  })
}