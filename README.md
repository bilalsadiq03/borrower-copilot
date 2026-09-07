# Borrower Copilot

Borrower Copilot is a borrower-first self-assessment tool for Indian
borrowers. It helps a borrower make a better decision before approaching
a lender by answering four questions:

1.  **Should I borrow at all?**
2.  **How much am I really eligible for?**
3.  **What is a fair rate for me?**
4.  **What EMI / monthly outflow should I agree to?**

The product then turns those results into a **Negotiation Card** that
the borrower can use while comparing lender offers.

> **Important:** Borrower Copilot is a decision-support and
> self-assessment tool, not a lender approval or underwriting system.
> Estimates are based only on information provided by the borrower and
> documented assumptions.

## Features

-   Adaptive borrower questionnaire for salaried, self-employed and
    informal-income borrowers.
-   Borrow / Borrow less / Don't borrow recommendation.
-   Separate **likely lender amount** and **borrower-safe amount**.
-   Fair interest-rate **band**, rather than a false point estimate.
-   Approximate all-in APR including processing/upfront fees.
-   Safe monthly EMI ceiling.
-   Tenure trade-off showing the relationship between EMI and total
    repayment.
-   Stress testing for adverse income/rate scenarios.
-   Confidence and uncertainty handling.
-   Explainable reasons for important outputs.
-   Product routing for relevant loan categories.
-   One-screen Negotiation Card.
-   No login, bureau pull, backend requirement or borrower data storage.

## Tech Stack

-   Next.js
-   React
-   TypeScript
-   CSS / Tailwind CSS as implemented in the project
-   Client-side calculation and rule engine
-   No backend required

## Getting Started

### Prerequisites

Use a current LTS version of Node.js compatible with the project's
`package.json`.

### Install

``` bash
npm install
```

### Run locally

``` bash
npm run dev
```

Open:

``` text
http://localhost:3000
```

### Production build

``` bash
npm run build
```

## How It Works

``` text
Borrower answers questions
        ↓
BorrowerProfile
        ↓
Adaptive questionnaire / missing-data handling
        ↓
Rules engine
        ↓
Affordability + lender estimate
        ↓
Fair-rate + APR calculation
        ↓
Safe EMI + stress testing
        ↓
Product routing + explanations
        ↓
Borrowing snapshot
        ↓
Negotiation Card
```

The rules and calculations are kept outside the UI so that financial
assumptions can be inspected and changed independently.

## Core Outputs

### O1 --- Borrowing decision

The application can recommend:

-   **Borrow**
-   **Borrow less**
-   **Don't borrow**

A decision is accompanied by a concise reason based on the borrower's
inputs.

### O2 --- Amount

The application deliberately separates:

-   **Estimated lender amount** --- an indicative lender-style
    affordability estimate.
-   **Borrower-safe amount** --- a more conservative amount intended to
    protect the borrower's monthly buffer.

The borrower-safe amount is the number to use when deciding how much to
take.

### O3 --- Fair rate and APR

The fair rate is presented as a range.

The application also estimates an all-in APR using the loan cash flows
and upfront fees. This is an indicative calculation, not an official
lender APR.

### O4 --- Safe EMI

The application provides a monthly EMI/outflow ceiling and shows tenure
trade-offs and a stress scenario.

Longer tenure can reduce monthly EMI while increasing total interest.

## Adaptive Question Design

The questionnaire has a small core set of questions that can produce all
four outputs, followed by additional questions only when they are
relevant.

Core information includes:

-   loan purpose
-   requested amount
-   loan type
-   net monthly income
-   income type
-   existing EMIs
-   household expenses
-   age
-   credit score, if known

Additional questions are used when they can change an output, such as:

-   employment or business tenure
-   income stability
-   variable income
-   credit utilization
-   past EMI bounces
-   emergency savings
-   collateral
-   co-applicant information
-   upcoming large expenses
-   productive use of the loan

The product follows two important principles:

1.  **Unknown is not zero.**
2.  **Missing information should reduce confidence and, where
    appropriate, widen ranges rather than create false precision.**

## Privacy

Borrower Copilot is designed as a local self-assessment tool.

-   No login is required.
-   No bureau pull is performed.
-   No lender API is required.
-   No personal borrower data needs to be stored on a backend.

## Limitations

Borrower Copilot does not know:

-   the borrower's actual credit-bureau file unless the borrower
    supplies information;
-   lender-specific underwriting policies;
-   lender-specific approval probabilities;
-   verified income or bank statements;
-   exact collateral valuation;
-   lender-specific fees and charges unless supplied;
-   future changes in income, expenses, interest rates or economic
    conditions.

Therefore, outputs are indicative and should be compared with actual
lender offers.

See [`RULES.md`](./RULES.md) for the assumptions and thresholds used by
the engine.

## Submission Deliverables

This repository contains the four required challenge deliverables at the
root:

-   [`RULES.md`](./RULES.md) --- rules, thresholds, bands and
    assumptions.
-   [`RUNTHROUGHS.md`](./RUNTHROUGHS.md) --- Priya, Ravi and Anita
    run-throughs.
-   [`WALKTHROUGH.md`](./WALKTHROUGH.md) --- five-minute walkthrough
    script.
-   Working application --- the Next.js project in this repository.

## Challenge Personas

The application is designed to demonstrate different reasoning for:

-   **Priya** --- salaried software engineer with strong credit history.
-   **Ravi** --- self-employed kirana owner with no formal credit
    history but meaningful unencumbered collateral.
-   **Anita** --- informal-income borrower with existing high-cost app
    loans and a recent EMI bounce.

The run-through document records the actual question path and outputs
produced by the application.

## Disclaimer

Borrower Copilot provides an indicative self-assessment based on
user-provided information and documented assumptions. It is not a credit
approval, financial guarantee, lender quote or substitute for lender
underwriting or professional financial advice.
