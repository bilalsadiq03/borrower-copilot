import { describe, test } from "node:test"
import assert from "node:assert/strict"

import { calculateAPR } from "@/lib/calculations/apr"
import { runStressTest } from "@/lib/stress/engine"
import { evaluateBorrower } from "@/lib/rules/engine"

const priya = {
  age: 29,
  employmentType: "salaried" as const,
  monthlyIncome: 110000,
  monthlyExpenses: 38000,
  existingEMI: 14000,
  loanPurpose: "wedding" as const,
  loanType: "personal" as const,
  loanAmount: 800000,
  creditScore: 780,
  creditScoreKnown: true,
  incomeStability: "stable" as const,
  employmentTenure: "5+",
  variableIncomePercent: 0,
}

const ravi = {
  age: 42,
  employmentType: "self-employed" as const,
  monthlyIncome: 60000,
  monthlyExpenses: 25000,
  existingEMI: 0,
  loanPurpose: "business" as const,
  loanType: "business" as const,
  loanAmount: 1500000,
  creditScoreKnown: false,
  incomeStability: "variable" as const,
  businessTenure: "10+",
  itrIncome: 420000,
  hasCollateral: "yes" as const,
  collateralValue: 4500000,
}

const anita = {
  age: 35,
  employmentType: "informal" as const,
  monthlyIncome: 28000,
  monthlyExpenses: 12000,
  existingEMI: 15000,
  loanPurpose: "vehicle" as const,
  loanType: "two-wheeler" as const,
  loanAmount: 150000,
  creditScoreKnown: false,
  incomeStability: "highly-variable" as const,
  existingLoanCount: 3,
  recentBounce: true,
  emergencySavingsMonths: 0.5,
  productiveLoan: true,
}

const sparseBorrower = {
  age: 31,
  employmentType: "informal" as const,
  monthlyIncome: 32000,
  monthlyExpenses: 18000,
  existingEMI: 2000,
  loanPurpose: "personal" as const,
  loanType: "personal" as const,
  loanAmount: 120000,
  creditScoreKnown: false,
  incomeStability: "variable" as const,
}

describe("borrower rules", () => {
  test("strong salaried borrower is borrowable with a wider lender range than safe range", () => {
    const result = evaluateBorrower(priya)

    assert.equal(result.decision, "borrow")
    assert.equal(result.confidence, "high")
    assert.equal(result.productRoute, "personal")
    assert.ok(result.lenderAmount.max > result.safeAmount.max)
    assert.ok(result.fairRate.min < result.fairRate.max)
  })

  test("self-employed borrower routes toward a secured product when collateral is available", () => {
    const result = evaluateBorrower(ravi)

    assert.equal(result.productRoute, "secured-lap")
    assert.ok(result.flags.includes("Credit score unknown"))
    assert.ok(result.safeAmount.max > 0)
    assert.equal(result.confidence, "medium")
  })

  test("high-risk informal borrower is told not to borrow", () => {
    const result = evaluateBorrower(anita)

    assert.equal(result.decision, "dont-borrow")
    assert.ok(result.decisionReason.length > 0)
    assert.ok(result.flags.includes("Recent EMI bounce"))
  })

  test("unknown credit score widens the fair-rate band", () => {
    const known = evaluateBorrower(priya)
    const unknown = evaluateBorrower({
      ...priya,
      creditScoreKnown: false,
      creditScore: undefined,
    })

    const knownWidth =
      known.fairRate.max - known.fairRate.min
    const unknownWidth =
      unknown.fairRate.max - unknown.fairRate.min

    assert.ok(
      unknownWidth > knownWidth,
      "unknown credit should widen the fair-rate band"
    )
    assert.ok(
      unknown.missingInputs.includes("credit score")
    )
  })

  test("missing optional inputs reduce confidence", () => {
    const result = evaluateBorrower(sparseBorrower)

    assert.equal(result.confidence, "low")
    assert.ok(result.missingInputs.length >= 3)
  })

  test("dont-borrow path is reachable", () => {
    const result = evaluateBorrower(anita)

    assert.equal(result.decision, "dont-borrow")
  })

  test("borrow-less path is reachable", () => {
    const stretchedPriya = evaluateBorrower({
      ...priya,
      loanAmount: 3000000,
    })

    assert.equal(stretchedPriya.decision, "borrow-less")
  })

  test("APR includes processing fees", () => {
    const aprWithFee = calculateAPR(
      800000,
      11.5,
      60,
      2,
      0
    )
    const aprWithUpfrontCharge = calculateAPR(
      800000,
      11.5,
      60,
      0,
      4999
    )

    assert.ok(aprWithFee > 11.5)
    assert.ok(aprWithUpfrontCharge > 11.5)
  })

  test("stress scenario raises FOIR and lowers disposable income", () => {
    const result = evaluateBorrower(priya)
    const stress = runStressTest(priya, result, {
      incomeChangePercent: -20,
      expenseChangePercent: 10,
      rateChangePercent: 2,
    })

    assert.ok(stress.stressedFOIR > stress.normalFOIR)
    assert.ok(
      stress.stressedDisposableIncome <
        stress.normalDisposableIncome
    )
  })

  test("high, medium and low confidence are all reachable", () => {
    const high = evaluateBorrower(priya)
    const medium = evaluateBorrower(ravi)
    const low = evaluateBorrower(sparseBorrower)

    assert.equal(high.confidence, "high")
    assert.equal(medium.confidence, "medium")
    assert.equal(low.confidence, "low")
  })

  test("range widening responds to missing information", () => {
    const complete = evaluateBorrower(priya)
    const missing = evaluateBorrower({
      ...priya,
      creditScoreKnown: false,
      creditScore: undefined,
      employmentTenure: undefined,
      variableIncomePercent: undefined,
    })

    const completeSafeWidth =
      complete.safeAmount.max -
      complete.safeAmount.min
    const missingSafeWidth =
      missing.safeAmount.max -
      missing.safeAmount.min

    assert.ok(
      missingSafeWidth > completeSafeWidth,
      "missing inputs should widen the safe amount range"
    )
  })

  test("ravi secured-product routing survives the full evaluation path", () => {
    const result = evaluateBorrower(ravi)

    assert.equal(result.productRoute, "secured-lap")
    assert.ok(result.safeAmount.max > 0)
    assert.ok(result.fairRate.max > result.fairRate.min)
  })
})
