import { Question } from "@/types/question"

export const adaptiveQuestions: Question[] = [
  // Salaried
  {
    id: "employmentTenure",
    title: "How long have you been with your current employer?",
    type: "radio",
    options: [
      { label: "Less than 1 year", value: "lt-1" },
      { label: "1–2 years", value: "1-2" },
      { label: "2–5 years", value: "2-5" },
      { label: "5+ years", value: "5+" },
    ],
    showWhen: (answers) =>
      answers.employmentType === "salaried",
  },

  {
    id: "variableIncomePercent",
    title: "How much of your income is variable?",
    type: "radio",
    options: [
      { label: "None", value: "0" },
      { label: "Less than 10%", value: "10" },
      { label: "10–25%", value: "25" },
      { label: "More than 25%", value: "50" },
    ],
    showWhen: (answers) =>
      answers.employmentType === "salaried",
  },

  // Self-employed
  {
    id: "businessTenure",
    title: "How long have you been running your business?",
    type: "radio",
    options: [
      { label: "Less than 2 years", value: "lt-2" },
      { label: "2–5 years", value: "2-5" },
      { label: "5–10 years", value: "5-10" },
      { label: "10+ years", value: "10+" },
    ],
    showWhen: (answers) =>
      answers.employmentType === "self-employed",
  },

  {
    id: "itrIncome",
    title: "What income does your latest ITR show?",
    type: "currency",
    showWhen: (answers) =>
      answers.employmentType === "self-employed",
  },

  {
    id: "hasCollateral",
    title: "Do you own property that could potentially secure the loan?",
    type: "radio",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
      { label: "I'm not sure", value: "unknown" },
    ],
    showWhen: (answers) =>
      answers.employmentType === "self-employed",
  },

  {
    id: "collateralValue",
    title: "What is the approximate property value?",
    type: "currency",
    showWhen: (answers) =>
      answers.hasCollateral === "yes",
  },

  // Informal
  {
    id: "existingLoanCount",
    title: "How many loans are you currently repaying?",
    type: "number",
    min: 0,
    max: 20,
    showWhen: (answers) =>
      answers.employmentType === "informal",
  },

  {
    id: "recentBounce",
    title: "Have you missed or bounced an EMI in the last 6 months?",
    type: "radio",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
      { label: "I'm not sure", value: "unknown" },
    ],
    showWhen: (answers) =>
      answers.employmentType === "informal",
  },

  {
    id: "emergencySavingsMonths",
    title: "How many months of essential expenses do you have saved?",
    type: "radio",
    options: [
      { label: "None", value: "0" },
      { label: "Less than 1 month", value: "0.5" },
      { label: "1–3 months", value: "2" },
      { label: "3+ months", value: "4" },
    ],
    showWhen: (answers) =>
      answers.employmentType === "informal",
  },

  {
    id: "productiveLoan",
    title: "Would this loan directly increase your income?",
    type: "radio",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
      { label: "I'm not sure", value: "unknown" },
    ],
    showWhen: (answers) =>
      answers.employmentType === "informal",
  },
]