import type { RulesResult } from "@/lib/rules/types"

interface DecisionCardProps {
  result: RulesResult
}

export function DecisionCard({
  result,
}: DecisionCardProps) {
  const config = {
    borrow: {
      label: "Borrowing looks manageable",
      description:
        "Your requested borrowing fits within the current affordability and stress-test limits.",
      badge: "BORROW",
    },

    "borrow-less": {
      label: "Consider borrowing less",
      description:
        "The requested amount is higher than what your current cash flow can comfortably support.",
      badge: "BORROW LESS",
    },

    "dont-borrow": {
      label: "We recommend waiting",
      description:
        "Taking on another loan would put too much pressure on your current financial position.",
      badge: "DON'T BORROW",
    },
  }[result.decision]

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-600">
            Borrowing recommendation
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {config.label}
          </h2>

          <p className="mt-2 max-w-2xl text-gray-600">
            {config.description}
          </p>
        </div>

        <span className="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-900">
          {config.badge}
        </span>
      </div>

      <div className="mt-5 rounded-xl bg-gray-50 p-4">
        <p className="text-sm font-medium">
          Why?
        </p>

        <p className="mt-1 text-sm text-gray-600">
          {result.decisionReason}
        </p>
      </div>
    </section>
  )
}