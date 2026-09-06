"use client"

import { useBorrowerQuestionnaire } from "@/hooks/useBorrowerQuestionnaire"
import type { BorrowerProfile } from "@/types/borrower"

interface QuestionnaireProps {
  onComplete: (profile: BorrowerProfile) => void
}

export function Questionnaire({
  onComplete,
}: QuestionnaireProps) {
  const {
    currentQuestion,
    currentIndex,
    questions,
    progress,
    profile,
    setAnswer,
    next,
    back,
    isFirst,
    isLast,
  } = useBorrowerQuestionnaire()

  if (!currentQuestion) {
    return null
  }

  const value =
    profile[currentQuestion.id as keyof typeof profile]

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-white">
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-sm text-white/60">
          <span>
            Question {currentIndex + 1} of{" "}
            {questions.length}
          </span>

          <span>
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-white transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-white/50">
          Borrower profile
        </p>

        <h1 className="mt-2 text-3xl font-semibold">
          {currentQuestion.title}
        </h1>

        {currentQuestion.description && (
          <p className="mt-3 text-white/60">
            {currentQuestion.description}
          </p>
        )}

        <div className="mt-8">
          {currentQuestion.type === "currency" ||
          currentQuestion.type === "number" ||
          currentQuestion.type === "text" ? (
            <input
              type={
                currentQuestion.type === "text"
                  ? "text"
                  : "number"
              }
              value={
                value === undefined
                  ? ""
                  : String(value)
              }
              onChange={(event) => {
                const raw =
                  event.target.value

                setAnswer(
                  currentQuestion.id,
                  currentQuestion.type ===
                    "number" ||
                    currentQuestion.type ===
                      "currency"
                    ? raw === ""
                      ? undefined
                      : Number(raw)
                    : raw
                )
              }}
              placeholder={
                currentQuestion.placeholder
              }
              className="w-full rounded-xl border border-white/15 bg-black px-4 py-4 text-lg text-white outline-none placeholder:text-white/30 focus:border-white/40"
            />
          ) : null}

          {currentQuestion.type ===
            "select" && (
            <div className="grid gap-3">
              {currentQuestion.options?.map(
                (option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setAnswer(
                        currentQuestion.id,
                        option.value
                      )
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      value === option.value
                        ? "border-white bg-white text-black"
                        : "border-white/15 bg-black text-white hover:border-white/40"
                    }`}
                  >
                    {option.label}
                  </button>
                )
              )}
            </div>
          )}

          {currentQuestion.type ===
            "boolean" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  setAnswer(
                    currentQuestion.id,
                    true
                  )
                }
                className={`rounded-xl border p-4 ${
                  value === true
                    ? "border-white bg-white text-black"
                    : "border-white/15 bg-black text-white"
                }`}
              >
                Yes
              </button>

              <button
                type="button"
                onClick={() =>
                  setAnswer(
                    currentQuestion.id,
                    false
                  )
                }
                className={`rounded-xl border p-4 ${
                  value === false
                    ? "border-white bg-white text-black"
                    : "border-white/15 bg-black text-white"
                }`}
              >
                No
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={back}
          disabled={isFirst}
          className="rounded-xl border border-white/15 px-5 py-3 text-white disabled:opacity-30"
        >
          Back
        </button>

        <button
          type="button"
          onClick={() => {
            if (isLast) {
              onComplete(profile as BorrowerProfile)
              return
            }
            next()
          }}
          disabled={
            currentQuestion.required &&
            (value === undefined ||
              value === "")
          }
          className="rounded-xl bg-white px-6 py-3 font-medium text-black disabled:opacity-30"
        >
          {isLast ? "See my results" : "Continue"}
        </button>
      </div>
    </main>
  )
}