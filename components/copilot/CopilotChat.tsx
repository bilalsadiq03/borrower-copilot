"use client"

import {
  useState,
} from "react"

import type { BorrowerProfile } from "@/types/borrower"
import type { RulesResult } from "@/lib/rules/types"
import type { LoanOffer } from "@/lib/offers/types"

import {
  getCopilotResponse,
} from "@/lib/copilot/chatEngine"

interface CopilotChatProps {
  profile: BorrowerProfile
  result: RulesResult
  offers: LoanOffer[]
}

export function CopilotChat({
  profile,
  result,
  offers,
}: CopilotChatProps) {
  const [question, setQuestion] =
    useState("")

  const [messages, setMessages] =
    useState<
      {
        id: string
        role: "user" | "assistant"
        content: string
      }[]
    >([])

  function askQuestion(
    text: string
  ) {
    const trimmed =
      text.trim()

    if (!trimmed) {
      return
    }

    const answer =
      getCopilotResponse(
        trimmed,
        {
          profile,
          result,
          offers,
        }
      )

    setMessages(
      (current) => [
        ...current,
        {
          id:
            `${Date.now()}-user`,
          role: "user",
          content: trimmed,
        },
        {
          id:
            `${Date.now()}-assistant`,
          role: "assistant",
          content: answer,
        },
      ]
    )

    setQuestion("")
  }

  const suggestions = [
    "Why shouldn't I borrow the full amount?",
    "What happens if my income drops 20%?",
    "Which offer is safer for me?",
  ]

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div>
        <p className="text-sm text-white/50">
          Borrower Copilot
        </p>

        <h2 className="mt-1 text-2xl font-semibold text-white">
          Ask about your decision
        </h2>

        <p className="mt-2 text-sm text-white/60">
          Ask questions about affordability,
          risk, EMI or the indicative offers.
        </p>
      </div>

      {messages.length > 0 && (
        <div className="mt-6 space-y-4">
          {messages.map(
            (message) => (
              <div
                key={message.id}
                className={
                  message.role ===
                  "user"
                    ? "ml-auto max-w-[85%] rounded-xl bg-white px-4 py-3 text-sm text-black"
                    : "max-w-[90%] rounded-xl border border-white/10 bg-black px-4 py-3 text-sm leading-6 text-white/80"
                }
              >
                {message.content}
              </div>
            )
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {suggestions.map(
          (suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() =>
                askQuestion(
                  suggestion
                )
              }
              className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/70 hover:border-white/30 hover:text-white"
            >
              {suggestion}
            </button>
          )
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          askQuestion(question)
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={question}
          onChange={(event) =>
            setQuestion(
              event.target.value
            )
          }
          placeholder="Ask your Copilot..."
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
        />

        <button
          type="submit"
          disabled={!question.trim()}
          className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black disabled:opacity-30"
        >
          Ask
        </button>
      </form>

      <p className="mt-4 text-xs text-white/30">
        Copilot responses are based on the
        information you provided and are for
        decision support, not financial advice.
      </p>
    </section>
  )
}