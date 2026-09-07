import type { RulesResult } from "@/lib/rules/types"
import { formatCurrency } from "@/utils/format"

interface AffordabilityCardProps {
  result: RulesResult
}

export function AffordabilityCard({
  result,
}: AffordabilityCardProps) {
  return (
    <section className="rounded-2xl border bg-black text-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-gray-500">
          Affordability
        </p>

        <h2 className="mt-1 text-xl font-semibold">
          Your debt capacity
        </h2>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-gray-500">
            Borrower FOIR
          </p>

          <p className="mt-1 text-xl font-semibold">
            {(result.borrowerFOIR * 100).toFixed(0)}%
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Lender estimate
          </p>

          <p className="mt-1 text-xl font-semibold">
            {(result.lenderFOIR * 100).toFixed(0)}%
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Safe EMI
          </p>

          <p className="mt-1 text-xl font-semibold">
            {formatCurrency(result.safeEMI.max)}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border p-4">
        <div className="flex items-center color-blue justify-between text-sm">
          <span>Borrower-safe threshold</span>
          <span className="font-medium">
            {(result.borrowerFOIR * 100).toFixed(0)}%
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-black"
            style={{
              width: `${Math.min(
                result.borrowerFOIR * 100,
                100
              )}%`,
            }}
          />
        </div>
      </div>
    </section>
  )
}