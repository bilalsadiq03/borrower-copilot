import type { Question } from "./types"

export const ADAPTIVE_QUESTIONS: Question[] = [
  {
    id: "employmentTenure",
    title: "How long have you been earning from your current work?",
    type: "text",

    showWhen: (profile) =>
      profile.employmentType === "salaried" ||
      profile.employmentType === "self-employed",
  },

  {
    id: "businessTenure",
    title: "How long has your business been running?",
    type: "text",

    showWhen: (profile) =>
      profile.employmentType === "self-employed",
  },

  {
    id: "incomeStability",
    title: "How stable is your monthly income?",
    type: "select",

    options: [
      {
        label: "Very stable",
        value: "stable",
      },
      {
        label: "Somewhat variable",
        value: "variable",
      },
      {
        label: "Highly variable",
        value: "highly-variable",
      },
    ],

    showWhen: (profile) =>
      profile.employmentType === "self-employed" ||
      profile.employmentType === "informal",
  },

  {
    id: "itrIncome",
    title: "What annual income does your ITR show?",
    type: "currency",

    showWhen: (profile) =>
      profile.employmentType === "self-employed",
  },

  {
    id: "recentBounce",
    title: "Have you missed or bounced an EMI recently?",
    type: "boolean",
  },

  {
    id: "emergencySavingsMonths",
    title: "How many months of expenses could your savings cover?",
    type: "number",
    placeholder: "e.g. 3",
  },

  {
    id: "hasCollateral",
    title: "Do you have property or another asset you could offer as collateral?",
    type: "select",

    options: [
      {
        label: "Yes",
        value: "yes",
      },
      {
        label: "No",
        value: "no",
      },
      {
        label: "I don't know",
        value: "unknown",
      },
    ],

    showWhen: (profile) =>
      profile.employmentType === "self-employed" ||
      profile.loanType === "lap",
  },

  {
    id: "collateralValue",
    title: "Approximately what is the collateral worth?",
    type: "currency",

    showWhen: (profile) =>
      profile.hasCollateral === "yes",
  },
]