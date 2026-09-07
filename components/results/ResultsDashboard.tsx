"use client"

import type { RulesResult } from "@/lib/rules/types"
import type { CopilotRecommendation } from "@/lib/copilot/types"

import { BorrowingSnapshot } from "./BorrowingSnapshot"
import { DecisionCard } from "./DecisionCard"
import { AffordabilityCard } from "./AffordabilityCard"
import { StressTestCard } from "./StressTestCard"
import { ExplanationList } from "./ExplanationList"
import { NegotiationCard } from "./NegotiationCard"
import type { LoanOffer } from "@/lib/offers/types"
import { OfferComparison } from "@/components/offers/OfferComparision"
import { CopilotChat } from "@/components/copilot/CopilotChat"
import type { BorrowerProfile } from "@/types/borrower"
import { StressTest } from "@/components/stress/StressTest"

interface ResultsDashboardProps {
  profile: BorrowerProfile
  result: RulesResult
  recommendation: CopilotRecommendation
  offers: LoanOffer[]
  onStartOver?: () => void
}

export function ResultsDashboard({
  profile,
  result,
  recommendation,
  offers,
  onStartOver,
}: ResultsDashboardProps) {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header>
        <p className="text-sm font-medium text-gray-500">
          Borrower Copilot
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Your borrowing snapshot
        </h1>

        <p className="mt-2 text-gray-600">
          A borrower-first view of what you may be able
          to borrow and what may be safer for you.
        </p>
      </header>

      <NegotiationCard
        profile={profile}
        result={result}
        recommendation={recommendation}
      />

      <StressTest
        profile={profile}
        result={result}
      />

      <OfferComparison offers={offers} />

      <div className="mt-8">
        <CopilotChat
          profile={profile}
          result={result}
          offers={offers}
        />
      </div>

      <DecisionCard result={result} />

      <BorrowingSnapshot result={result} />

      <div className="grid gap-6 lg:grid-cols-2">
        <AffordabilityCard result={result} />
        <StressTestCard result={result} />
      </div>

      <ExplanationList
        recommendation={recommendation}
      />

      {onStartOver && (
        <button
          type="button"
          onClick={onStartOver}
          className="rounded-xl border border-white/15 px-5 py-3 text-sm text-white hover:border-white/30"
        >
          Start over
        </button>
      )}

      <footer className="rounded-xl border bg-gray-50 p-4 text-xs text-gray-500">
        Estimates are indicative and based on the
        information you provided. They are not a guarantee
        of loan approval or pricing.
      </footer>
    </main>
  )
}
