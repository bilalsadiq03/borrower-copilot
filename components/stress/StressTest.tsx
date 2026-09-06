"use client"

import { useState } from "react"

import type { BorrowerProfile } from "@/types/borrower"
import type { RulesResult } from "@/lib/rules/types"

import { runStressTest } from "@/lib/stress/engine"

interface StressTestProps {
  profile: BorrowerProfile
  result: RulesResult
}

function currency(value: number) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(value)
}

export function StressTest({
  profile,
  result,
}: StressTestProps) {
  const [incomeChange, setIncomeChange] =
    useState(0)

  const [expenseChange, setExpenseChange] =
    useState(0)

  const [rateChange, setRateChange] =
    useState(0)

  const stressResult =
    runStressTest(
      profile,
      result,
      {
        incomeChangePercent:
          incomeChange,

        expenseChangePercent:
          expenseChange,

        rateChangePercent:
          rateChange,
      }
    )

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div>
        <p className="text-sm text-white/50">
          What if?
        </p>

        <h2 className="mt-1 text-2xl font-semibold text-white">
          Stress-test your loan
        </h2>

        <p className="mt-2 text-sm text-white/60">
          See how your repayment capacity changes
          if your financial situation changes.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <div className="flex justify-between">
            <label className="text-sm text-white/70">
              Monthly income change
            </label>

            <span className="text-sm text-white">
              {incomeChange}%
            </span>
          </div>

          <input
            type="range"
            min="-50"
            max="30"
            step="5"
            value={incomeChange}
            onChange={(event) =>
              setIncomeChange(
                Number(event.target.value)
              )
            }
            className="mt-3 w-full"
          />
        </div>

        <div>
          <div className="flex justify-between">
            <label className="text-sm text-white/70">
              Monthly expense change
            </label>

            <span className="text-sm text-white">
              +{expenseChange}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={expenseChange}
            onChange={(event) =>
              setExpenseChange(
                Number(event.target.value)
              )
            }
            className="mt-3 w-full"
          />
        </div>

        <div>
          <div className="flex justify-between">
            <label className="text-sm text-white/70">
              Interest rate change
            </label>

            <span className="text-sm text-white">
              +{rateChange}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="30"
            step="5"
            value={rateChange}
            onChange={(event) =>
              setRateChange(
                Number(event.target.value)
              )
            }
            className="mt-3 w-full"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs text-white/40">
            Income
          </p>

          <p className="mt-1 font-medium text-white">
            {currency(
              stressResult.monthlyIncome
            )}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs text-white/40">
            Estimated EMI
          </p>

          <p className="mt-1 font-medium text-white">
            {currency(
              stressResult.estimatedEMI
            )}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs text-white/40">
            EMI / Income
          </p>

          <p className="mt-1 font-medium text-white">
            {(
              stressResult.foir * 100
            ).toFixed(1)}
            %
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 p-4">
        <p className="text-sm font-medium text-white">
          {stressResult.safe
            ? "Still manageable"
            : "Repayment pressure increases"}
        </p>

        <p className="mt-2 text-sm leading-6 text-white/60">
          {stressResult.message}
        </p>
      </div>
    </section>
  )
}