"use client"

import { useState } from "react"

import type { BorrowerProfile } from "@/types/borrower"
import type { RulesResult } from "@/lib/rules/types"
import type { CopilotRecommendation } from "@/lib/copilot/types"

import { Questionnaire } from "@/components/questionnaire/Questionnaire"
import { ResultsDashboard } from "@/components/results/ResultsDashboard"

import { evaluateBorrower } from "@/lib/rules/engine"
import { generateCopilotRecommendation } from "@/lib/copilot/explanation"
import { generateOffers } from "@/lib/offers/genearteOffers"
import type { LoanOffer } from "@/lib/offers/types"

export default function Home() {
  const [result, setResult] = useState<RulesResult | null>(
    null
  )

  const [offers, setOffers] = useState<LoanOffer[]>([])

  const [profile, setProfile] =
    useState<BorrowerProfile | null>(null)

  const [recommendation, setRecommendation] =
    useState<CopilotRecommendation | null>(null)

  function handleComplete(
    profile: BorrowerProfile
  ) {
    const rulesResult =
      evaluateBorrower(profile)

    setProfile(profile)

    const generatedOffers =
      generateOffers(profile, rulesResult)

    const copilotRecommendation =
      generateCopilotRecommendation(
        profile,
        rulesResult
      )

    setResult(rulesResult)
    setOffers(generatedOffers)
    setRecommendation(
      copilotRecommendation
    )
  }

  const currentProfile = profile
  const currentResult = result
  const currentRecommendation = recommendation

  if (currentProfile && currentResult && currentRecommendation) {
    return (
      <ResultsDashboard
        profile={currentProfile}
        result={currentResult}
        recommendation={currentRecommendation}
        offers={offers}
        onStartOver={() => {
          setProfile(null)
          setResult(null)
          setRecommendation(null)
          setOffers([])
        }}
      />
    )
  }

  return (
    <Questionnaire
      onComplete={handleComplete}
    />
  )
}
