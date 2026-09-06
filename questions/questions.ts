import { Question } from "@/types/question"

export const mustQuestions: Question[] = [
  {
    id: "age",
    title: "How old are you?",
    type: "number",
    required: true,
    min: 18,
    max: 80,
  },

  {
    id: "employmentType",
    title: "What best describes your income?",
    type: "radio",
    required: true,
    options: [
      { label: "Salaried", value: "salaried" },
      { label: "Self-employed", value: "self-employed" },
      { label: "Informal / variable income", value: "informal" },
    ],
  },

  {
    id: "monthlyIncome",
    title: "What is your monthly take-home income?",
    description: "Use your usual monthly income after taxes.",
    type: "currency",
    required: true,
    min: 0,
  },

  {
    id: "incomeStability",
    title: "How stable is your income?",
    type: "radio",
    required: true,
    options: [
      { label: "Very stable", value: "very-stable" },
      { label: "Mostly stable", value: "stable" },
      { label: "Varies somewhat", value: "variable" },
      { label: "Highly variable", value: "highly-variable" },
    ],
  },

  {
    id: "loanType",
    title: "What type of loan are you considering?",
    type: "radio",
    required: true,
    options: [
      { label: "Personal loan", value: "personal" },
      { label: "Home loan", value: "home" },
      { label: "Loan against property", value: "lap" },
      { label: "Gold loan", value: "gold" },
      { label: "Two-wheeler loan", value: "two-wheeler" },
      { label: "Business loan", value: "business" },
    ],
  },

  {
    id: "loanAmount",
    title: "How much do you want to borrow?",
    type: "currency",
    required: true,
    min: 1000,
  },

  {
    id: "loanPurpose",
    title: "What will you use the loan for?",
    type: "radio",
    required: true,
    options: [
      { label: "Wedding / family event", value: "wedding" },
      { label: "Medical expense", value: "medical" },
      { label: "Education", value: "education" },
      { label: "Home improvement", value: "home-improvement" },
      { label: "Vehicle", value: "vehicle" },
      { label: "Business / inventory", value: "business" },
      { label: "Debt consolidation", value: "debt-consolidation" },
      { label: "Emergency", value: "emergency" },
      { label: "Other", value: "other" },
    ],
  },

  {
    id: "existingEMI",
    title: "How much do you currently pay toward loans each month?",
    type: "currency",
    required: true,
    min: 0,
  },

  {
    id: "monthlyExpenses",
    title: "How much do you spend on household expenses each month?",
    type: "currency",
    required: true,
    min: 0,
  },

  {
    id: "creditScoreKnown",
    title: "Do you know your credit score?",
    type: "radio",
    required: true,
    options: [
      { label: "Yes", value: "yes" },
      { label: "No / I'm not sure", value: "no" },
    ],
  },

  {
    id: "creditScore",
    title: "What is your credit score?",
    type: "number",
    min: 300,
    max: 900,
    showWhen: (answers) =>
      answers.creditScoreKnown === "yes",
  },
]