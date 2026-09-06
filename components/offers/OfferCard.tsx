import type { LoanOffer } from "@/lib/offers/types"

interface OfferCardProps {
  offer: LoanOffer
  recommended?: boolean
}

function formatCurrency(
  value: number
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(value)
}

export function OfferCard({
  offer,
  recommended = false,
}: OfferCardProps) {
  return (
    <article
      className={`rounded-2xl border p-5 ${
        recommended
          ? "border-white/40 bg-white/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      {recommended && (
        <span className="text-xs font-medium text-white/70">
          BETTER FIT
        </span>
      )}

      <div className="mt-2 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {offer.lenderName}
          </h3>

          <p className="text-sm text-white/50">
            {offer.loanType}
          </p>
        </div>

        <p className="text-lg font-semibold text-white">
          {offer.interestRate.toFixed(2)}%
        </p>
      </div>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-white/50">
            Loan amount
          </span>

          <span className="text-white">
            {formatCurrency(
              offer.loanAmount
            )}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/50">
            Monthly EMI
          </span>

          <span className="font-medium text-white">
            {formatCurrency(offer.emi)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/50">
            Processing fee
          </span>

          <span className="text-white">
            {formatCurrency(
              offer.processingFee
            )}
          </span>
        </div>

        <div className="border-t border-white/10 pt-3">
          <div className="flex justify-between">
            <span className="text-white/50">
              Total repayment
            </span>

            <span className="font-medium text-white">
              {formatCurrency(
                offer.totalRepayment
              )}
            </span>
          </div>
        </div>
      </div>

      {offer.note && (
        <p className="mt-5 text-xs text-white/50">
          {offer.note}
        </p>
      )}
    </article>
  )
}