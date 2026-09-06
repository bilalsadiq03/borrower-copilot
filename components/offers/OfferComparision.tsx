"use client"

import type { LoanOffer } from "@/lib/offers/types"

import { OfferCard } from "./OfferCard"

interface OfferComparisonProps {
  offers: LoanOffer[]
}

export function OfferComparison({
  offers,
}: OfferComparisonProps) {
  if (!offers.length) {
    return null
  }

  const recommendedOffer =
    [...offers]
      .filter((offer) => offer.suitable)
      .sort(
        (a, b) =>
          a.totalCost - b.totalCost
      )[0]

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm text-white/50">
          Indicative offers
        </p>

        <h2 className="mt-1 text-2xl font-semibold text-white">
          Compare your options
        </h2>

        <p className="mt-2 text-sm text-white/60">
          Don't compare loans on EMI alone.
          Look at the rate, fees and total
          repayment together.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            recommended={
              recommendedOffer?.id ===
              offer.id
            }
          />
        ))}
      </div>

      <p className="text-xs text-white/40">
        These are illustrative offers for
        comparison only and are not guaranteed
        lender quotes.
      </p>
    </section>
  )
}