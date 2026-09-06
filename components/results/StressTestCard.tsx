import type { RulesResult } from "@/lib/rules/types"
import { formatCurrency } from "@/utils/format"

interface StressTestCardProps {
  result: RulesResult
}

export function StressTestCard({
  result,
}: StressTestCardProps) {
  const passes = result.stressTest.passes

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">
        Stress test
      </p>

      <h2 className="mt-1 text-xl font-semibold">
        What if your income falls by 20%?
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Current debt burden
          </p>

          <p className="mt-1 text-2xl font-semibold">
            {(result.stressTest.normalFOIR * 100).toFixed(1)}%
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Under stress
          </p>

          <p className="mt-1 text-2xl font-semibold">
            {(result.stressTest.stressedFOIR * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border p-4">
        <p className="text-sm font-medium">
          {passes
            ? "The loan remains manageable under this scenario."
            : "The loan becomes difficult to sustain under this scenario."}
        </p>

        <p className="mt-1 text-sm text-gray-600">
          Disposable income after EMIs:
          {" "}
          {formatCurrency(
            result.stressTest.stressedDisposableIncome
          )}
        </p>
      </div>
    </section>
  )
}