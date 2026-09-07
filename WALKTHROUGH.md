# Five-Minute Walkthrough

This document is a script for a five-minute walkthrough of Borrower
Copilot.

The goal is to show the product, the reasoning behind it, and the
decisions made in the implementation.

------------------------------------------------------------------------

## 0:00--0:30 --- Problem and Product Thesis

**Show:** Landing page / opening screen.

**Say:**

> Borrower Copilot is a borrower-first self-assessment tool for Indian
> borrowers. Before walking into a lender, a borrower should know four
> things: whether they should borrow at all, how much they can safely
> carry, what rate is reasonable for their profile, and what EMI they
> should agree to.

> The important distinction is that this is not trying to reproduce a
> lender's underwriting model. It is designed to make the borrower the
> better-informed person in the room.

> Everything is based on what the borrower tells us and on transparent
> rules documented in `RULES.md`.

------------------------------------------------------------------------

## 0:30--1:30 --- Adaptive Questionnaire

**Show:** Questionnaire.

**Say:**

> The questionnaire starts with a tight core set of questions: purpose,
> requested amount, loan type, income, income type, existing EMIs,
> household expenses, age and credit score if known.

> Then it adapts. A salaried employee does not need to answer the same
> questions as a kirana owner or an informal-income borrower.

> For a self-employed borrower, we can ask about business tenure, ITR
> income and collateral. For an informal borrower, questions about
> income stability, existing high-cost debt and recent repayment stress
> become more relevant.

> Every additional question needs to earn its place by changing an
> output or changing confidence.

**Show:** One adaptive branch if possible.

**Key principle:**

> Unknown is not zero. If the borrower does not know their credit score,
> the system keeps it unknown, lowers confidence and avoids pretending
> that we know more than we do.

------------------------------------------------------------------------

## 1:30--3:00 --- Borrower Example and Four Outputs

**Show:** Complete one borrower run-through, preferably Priya first.

**Say:**

> Once the questionnaire is complete, Borrower Copilot produces four
> outputs.

### Output 1 --- Borrow / Borrow Less / Don't Borrow

> The first output is a decision, not just a number. The system can
> recommend borrowing, borrowing less, or not borrowing. Importantly,
> Don't Borrow is a legitimate outcome.

**Show the recommendation and reason.**

### Output 2 --- Lender Amount vs Borrower-Safe Amount

> The second output deliberately shows two different numbers.

> The lender estimate represents an indicative lender-style
> affordability ceiling.

> The borrower-safe amount is more conservative. This is the amount the
> borrower should actually use when deciding how much to take.

> Keeping these separate is important because what a lender may sanction
> is not necessarily what a borrower should comfortably carry.

**Show both ranges.**

### Output 3 --- Fair Rate and APR

> The third output is a fair-rate band rather than a single number.

> We also estimate an all-in APR using the loan cash flows and upfront
> fees. That makes it possible to compare a lender's quoted rate against
> the actual cost of borrowing.

**Show rate and APR.**

> This is clearly labelled as an estimate, not an official lender quote.

### Output 4 --- Safe EMI and Stress

> Finally, we give the borrower a monthly EMI ceiling and show the
> tenure trade-off.

> We also stress the result. For example, if income falls or the
> interest rate rises, the borrower can see how the debt burden changes.

**Show stress test.**

------------------------------------------------------------------------

## 3:00--4:00 --- Negotiation Card

**Show:** Negotiation Card.

**Say:**

> The key product artifact is the Negotiation Card.

> Instead of leaving the borrower with a dashboard full of numbers, we
> condense the useful information into one screen they can take to a
> lender.

The card contains:

-   requested amount;
-   borrower-safe amount;
-   likely lender range;
-   fair rate band;
-   approximate all-in APR;
-   processing fee;
-   safe EMI ceiling;
-   tenure trade-off;
-   reasons;
-   questions to ask the lender.

> If a lender quotes a rate above the borrower's fair range, the
> borrower now has a concrete question to ask instead of simply
> accepting the first offer.

**Show lender questions.**

> The card is deliberately framed as a self-assessment and not an
> approval.

------------------------------------------------------------------------

## 4:00--4:30 --- Stress Testing and Confidence

**Show:** Stress test and confidence sections.

**Say:**

> Borrowing decisions should not be based only on today's income.

> The stress test shows what happens when an adverse scenario occurs.

> Confidence is also explicit. If important information is missing, the
> system does not create false precision. It reduces confidence and
> widens estimates where appropriate.

> This is particularly important for Ravi, who has no known credit
> score, and Anita, whose informal and variable income makes the
> assessment less certain.

------------------------------------------------------------------------

## 4:30--5:00 --- What I Would Build Next / What I Would Cut

**Say:**

> If I had more time, I would build three things next.

### 1. Better lender-offer comparison

> I would allow the borrower to enter actual lender offers and compare
> rate, processing fee, APR, EMI and total repayment directly against
> the Negotiation Card.

### 2. More product-specific rules

> I would add deeper product rules for secured business lending, LAP,
> gold loans and vehicle finance while keeping every assumption
> transparent.

### 3. Evidence-backed personalization

> I would allow borrowers to optionally provide verified financial
> information, while keeping privacy and consent explicit.

### What I would cut

> I would not spend the next iteration on unnecessary visual complexity,
> a fake machine-learning credit score, or broad product coverage that
> does not improve the three challenge scenarios.

> The core value is transparent borrower reasoning: turning lending
> judgement into rules a borrower can see and a machine can run.

------------------------------------------------------------------------

## Closing

> Borrower Copilot does not promise approval. It gives the borrower a
> clearer position before negotiating with a lender: what they can
> likely be offered, what they can safely carry, what rate looks
> reasonable, and what questions they should ask.
