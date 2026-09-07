"use client"

import { Printer } from "lucide-react"

import type { BorrowerProfile } from "@/types/borrower"
import type { RulesResult } from "@/lib/rules/types"
import type { CopilotRecommendation } from "@/lib/copilot/types"
import { formatCurrency } from "@/utils/format"

import {
  buildNegotiationCardData,
} from "@/lib/rules/negotiation"

interface NegotiationCardProps {
  profile: BorrowerProfile
  result: RulesResult
  recommendation: CopilotRecommendation
}

function formatTenure(months: number) {
  const years = months / 12
  return `${years.toFixed(0)} years`
}

function confidenceCopy(
  confidence: RulesResult["confidence"]
) {
  if (confidence === "high") {
    return "High confidence - most key affordability information is available."
  }

  if (confidence === "medium") {
    return "Medium confidence - some information is missing."
  }

  return "Low confidence - several important inputs are unavailable."
}

export function NegotiationCard({
  profile,
  result,
  recommendation,
}: NegotiationCardProps) {
  const data = buildNegotiationCardData(
    profile,
    result,
    recommendation
  )

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">
            One-page negotiation card
          </p>

          <h2 className="mt-2 text-3xl font-semibold">
            My borrower negotiation card
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
            Self-assessment based on the information you provided. Not a lender approval.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-white/35 hover:text-white"
        >
          <Printer className="h-4 w-4" />
          Print card
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
          <p className="text-sm text-white/45">
            Loan request
          </p>

          <p className="mt-1 text-2xl font-semibold">
            {formatCurrency(data.requestedAmount)}
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                Borrower-safe amount
              </p>

              <p className="mt-1 text-lg font-medium text-emerald-300">
                {formatCurrency(data.safeAmount.min)} - {formatCurrency(data.safeAmount.max)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                Likely lender amount
              </p>

              <p className="mt-1 text-lg font-medium text-sky-300">
                {formatCurrency(data.lenderAmount.min)} - {formatCurrency(data.lenderAmount.max)}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-white/65">
            Use the borrower-safe ceiling when deciding how much to take.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
          <p className="text-sm text-white/45">
            Pricing
          </p>

          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-2xl font-semibold">
              {data.fairRate.min.toFixed(1)}% - {data.fairRate.max.toFixed(1)}%
            </p>

            <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60">
              Fair rate band
            </span>
          </div>

          <p className="mt-4 text-sm leading-6 text-white/65">
            Approx. all-in APR: {data.apr.min.toFixed(1)}% - {data.apr.max.toFixed(1)}%
          </p>

          <p className="mt-2 text-sm leading-6 text-white/65">
            Processing fee assumption: {data.processingFeePercent.toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-sm text-white/45">
            Safe monthly outflow
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {formatCurrency(data.safeEMI.min)} - {formatCurrency(data.safeEMI.max)}
          </p>

          <p className="mt-4 text-sm leading-6 text-white/65">
            Recommended tenure: {formatTenure(data.recommendedTenureMonths)}.
          </p>

          <p className="mt-2 text-sm leading-6 text-white/65">
            If stretched to {formatTenure(data.longerTenureMonths)}, EMI moves from {formatCurrency(data.recommendedEMI)} to {formatCurrency(data.longerEMI)}.
          </p>

          <p className="mt-2 text-sm leading-6 text-white/50">
            Longer tenure reduces EMI but increases total interest.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-sm text-white/45">
            Route and confidence
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {data.routeLabel}
          </p>

          <p className="mt-2 text-sm leading-6 text-white/65">
            {data.routeReason}
          </p>

          <p className="mt-4 text-sm font-medium text-white">
            {confidenceCopy(data.confidence)}
          </p>

          {data.missingInputs.length > 0 ? (
            <p className="mt-2 text-sm leading-6 text-white/55">
              Missing inputs: {data.missingInputs.join(", ")}
            </p>
          ) : (
            <p className="mt-2 text-sm leading-6 text-white/55">
              No key inputs are missing from the current profile.
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-sm text-white/45">
            Why this card says that
          </p>

          <div className="mt-3 space-y-3 text-sm leading-6 text-white/70">
            {data.reasons.map((reason) => (
              <p key={reason}>{reason}</p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-sm text-white/45">
            Ask the lender
          </p>

          <ul className="mt-3 space-y-2 text-sm leading-6 text-white/70">
            {data.negotiationQuestions.map((question) => (
              <li key={question}>- {question}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/60">
        {data.disclaimer}
      </div>
    </section>
  )
}
