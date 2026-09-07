import type { BorrowerProfile } from "@/types/borrower"
import type { RulesResult } from "@/lib/rules/types"
import type { LoanOffer } from "./types"

import { calculateEMI } from "@/lib/calculations/emi"
import { calculateAPR } from "../calculations/apr"

export function generateOffers(
  profile: BorrowerProfile,
  result: RulesResult
): LoanOffer[] {
  const requestedAmount =
    profile.loanAmount ?? 0

  const amount = Math.min(
    requestedAmount,
    result.safeAmount.max
  )

  const offerTemplates = [
    {
      id: "offer-1",
      lenderName: "Lender A",
      rate: result.fairRate.min,
      fee: 4999,
    },
    {
      id: "offer-2",
      lenderName: "Lender B",
      rate:
        result.fairRate.min + 1,
      fee: 2999,
    },
    {
      id: "offer-3",
      lenderName: "Lender C",
      rate:
        result.fairRate.max + 1,
      fee: 1999,
    },
  ]

  return offerTemplates.map(
    (template) => {
      const tenureMonths = 60
      const processingFee = template.fee

      const apr = calculateAPR(
        amount,
        template.rate,
        tenureMonths,
        0,
        processingFee
      )

      const emi = calculateEMI(
        amount,
        template.rate,
        tenureMonths
      )

      const totalRepayment =
        emi * tenureMonths

      const totalCost =
        totalRepayment -
        amount +
        processingFee

      const suitable =
        template.rate <=
          result.fairRate.max &&
        amount <= result.safeAmount.max

      return {
        id: template.id,

        lenderName:
          template.lenderName,

        loanType:
          profile.loanType ?? "personal",

        interestRate:
          template.rate,

        apr,

        processingFee:
          processingFee,

        tenureMonths,

        loanAmount:
          amount,

        emi,

        totalRepayment,

        totalCost,

        suitable,
      }
    }
  )
}
