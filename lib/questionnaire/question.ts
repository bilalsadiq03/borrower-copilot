import type { Question } from "./types"

export const MUST_QUESTIONS: Question[] = [
  {
    id: "loanPurpose",
    title: "What do you need the loan for?",
    type: "select",
    required: true,
    options: [
      {
        label: "Personal expense",
        value: "personal",
      },
      {
        label: "Home",
        value: "home",
      },
      {
        label: "Business",
        value: "business",
      },
      {
        label: "Vehicle",
        value: "vehicle",
      },
      {
        label: "Education",
        value: "education",
      },
      {
        label: "Other",
        value: "other",
      },
    ],
  },

  {
    id: "loanAmount",
    title: "How much do you want to borrow?",
    type: "currency",
    required: true,
    placeholder: "e.g. 800000",
  },

  {
    id: "loanType",
    title: "What type of loan are you considering?",
    type: "select",
    required: true,
    options: [
      {
        label: "Personal loan",
        value: "personal",
      },
      {
        label: "Home loan",
        value: "home",
      },
      {
        label: "Gold loan",
        value: "gold",
      },
      {
        label: "Two-wheeler loan",
        value: "two-wheeler",
      },
    ],
  },

  {
    id: "monthlyIncome",
    title: "What is your monthly take-home income?",
    description:
      "Use your usual monthly income after deductions.",
    type: "currency",
    required: true,
    placeholder: "e.g. 110000",
  },

  {
    id: "employmentType",
    title: "How do you earn your income?",
    type: "select",
    required: true,
    options: [
      {
        label: "Salaried",
        value: "salaried",
      },
      {
        label: "Self-employed",
        value: "self-employed",
      },
      {
        label: "Informal / gig work",
        value: "informal",
      },
    ],
  },

  {
    id: "existingEMI",
    title: "How much do you currently pay in EMIs each month?",
    type: "currency",
    required: true,
    placeholder: "Enter 0 if none",
  },

  {
    id: "monthlyExpenses",
    title: "About how much does your household spend each month?",
    type: "currency",
    required: true,
    placeholder: "e.g. 35000",
  },

  {
    id: "age",
    title: "How old are you?",
    type: "number",
    required: true,
    placeholder: "e.g. 29",
  },

  {
    id: "creditScoreKnown",
    title: "Do you know your credit score?",
    type: "boolean",
    required: true,
  },

  {
    id: "creditScore",
    title: "What is your credit score?",
    type: "number",

    showWhen: (profile) =>
      profile.creditScoreKnown === true,

    placeholder: "e.g. 780",
  },
]