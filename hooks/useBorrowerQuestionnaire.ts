"use client"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import type { BorrowerProfile } from "@/types/borrower"
import type { Question } from "@/lib/questionnaire/types"

import { getQuestions } from "@/lib/questionnaire/getQuestions"

export function useBorrowerQuestionnaire() {
  const [profile, setProfile] =
    useState<Partial<BorrowerProfile>>({})

  const [currentIndex, setCurrentIndex] =
    useState(0)

  /*
   * Questions are recalculated whenever the
   * borrower profile changes.
   *
   * This is what makes the questionnaire adaptive.
   */
  const questions = useMemo(
    () => getQuestions(profile),
    [profile]
  )

  /*
   * Prevent the current question index from
   * becoming invalid when adaptive questions
   * disappear after an answer changes.
   */
  useEffect(() => {
    if (currentIndex >= questions.length) {
      setCurrentIndex(
        Math.max(0, questions.length - 1)
      )
    }
  }, [currentIndex, questions.length])

  const currentQuestion: Question | undefined =
    questions[currentIndex]

  /*
   * Store an answer in the borrower profile.
   */
  function setAnswer(
    id: string,
    value: unknown
  ) {
    setProfile((current) => ({
      ...current,
      [id]: value,
    }))
  }

  /*
   * Move to the next question.
   */
  function next() {
    if (
      currentIndex <
      questions.length - 1
    ) {
      setCurrentIndex(
        (index) => index + 1
      )
    }
  }

  /*
   * Move to the previous question.
   */
  function back() {
    if (currentIndex > 0) {
      setCurrentIndex(
        (index) => index - 1
      )
    }
  }

  /*
   * Reset the entire questionnaire.
   */
  function reset() {
    setProfile({})
    setCurrentIndex(0)
  }

  /*
   * Current answer.
   */
  const currentValue =
    currentQuestion
      ? profile[
          currentQuestion.id as keyof BorrowerProfile
        ]
      : undefined

  /*
   * Progress percentage.
   */
  const progress =
    questions.length === 0
      ? 0
      : ((currentIndex + 1) /
          questions.length) *
        100

  /*
   * Check whether the current required
   * question has been answered.
   */
  const isCurrentQuestionAnswered =
    !currentQuestion?.required ||
    (
      currentValue !== undefined &&
      currentValue !== ""
    )

  return {
    // Borrower data
    profile,
    setAnswer,

    // Questions
    questions,
    currentQuestion,
    currentIndex,
    currentValue,

    // Navigation
    next,
    back,
    reset,

    // Progress
    progress,

    // State
    isFirst:
      currentIndex === 0,

    isLast:
      currentIndex ===
      questions.length - 1,

    isCurrentQuestionAnswered,

    isComplete:
      questions.length > 0 &&
      currentIndex ===
        questions.length - 1 &&
      isCurrentQuestionAnswered,
  }
}