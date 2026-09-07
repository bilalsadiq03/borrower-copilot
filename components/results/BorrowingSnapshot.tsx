import type { RulesResult } from "@/lib/rules/types"
import { formatCurrency } from "@/utils/format"

interface BorrowingSnapshotProps {
  result: RulesResult
}

export function BorrowingSnapshot({
  result,
}: BorrowingSnapshotProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border bg-black p-5 text-white shadow-sm">
        <p className="text-sm text-gray-200">
          Safe loan amount
        </p>

        <p className="mt-2 text-2xl font-semibold text-white">
          {formatCurrency(result.safeAmount.min)}
          {" - "}
          {formatCurrency(result.safeAmount.max)}
        </p>

        <p className="mt-2 text-xs text-gray-500">
          Based on your affordability
        </p>
      </div>

      <div className="rounded-xl border bg-black p-5 text-white shadow-sm">
        <p className="text-sm text-gray-200">
          Estimated lender amount
        </p>

        <p className="mt-2 text-2xl font-semibold text-white">
          {formatCurrency(result.lenderAmount.min)}
          {" - "}
          {formatCurrency(result.lenderAmount.max)}
        </p>

        <p className="mt-2 text-xs text-gray-500">
          Estimated eligibility, not a guarantee
        </p>
      </div>

      <div className="rounded-xl border bg-black p-5 text-white shadow-sm">
        <p className="text-sm text-gray-200">
          Fair rate range
        </p>

        <p className="mt-2 text-2xl font-semibold text-white">
          {result.fairRate.min.toFixed(1)}%
          {" - "}
          {result.fairRate.max.toFixed(1)}%
        </p>

        <p className="mt-2 text-xs text-gray-500">
          Indicative range
        </p>
      </div>

      <div className="rounded-xl border bg-black p-5 text-white shadow-sm">
        <p className="text-sm text-gray-200">
          Safe EMI
        </p>

        <p className="mt-2 text-2xl font-semibold text-white">
          {formatCurrency(result.safeEMI.min)}
          {" - "}
          {formatCurrency(result.safeEMI.max)}
        </p>

        <p className="mt-2 text-xs text-gray-500">
          Estimated monthly capacity
        </p>
      </div>
    </section>
  )
}
