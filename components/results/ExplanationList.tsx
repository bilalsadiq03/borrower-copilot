import type { CopilotRecommendation } from "@/lib/copilot/types"

interface ExplanationListProps {
  recommendation: CopilotRecommendation
}

export function ExplanationList({
  recommendation,
}: ExplanationListProps) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">
        Why we reached this recommendation
      </p>

      <div className="mt-5 space-y-4">
        {recommendation.explanations.map(
          (explanation, index) => (
            <div
              key={`${explanation.title}-${index}`}
              className="rounded-xl border p-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-black" />

                <div>
                  <h3 className="font-medium">
                    {explanation.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    {explanation.message}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {recommendation.actions.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium">
            What to do next
          </p>

          <ul className="mt-3 space-y-2">
            {recommendation.actions.map(
              (action, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600"
                >
                  - {action}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </section>
  )
}
