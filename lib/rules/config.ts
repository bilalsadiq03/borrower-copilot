export interface RateBand {
  min: number
  max: number
}

export interface ProductRule {
  lenderFOIR: number
  borrowerFOIR: number
  rate: RateBand
  processingFeePercent: number
  defaultTenureMonths: number
}

export const RULES = {
  affordability: {
    defaultLenderFOIR: 0.50,
    defaultBorrowerFOIR: 0.40,

    stressedFOIR: 0.50,
  },

  rates: {
    personal: {
      min: 10.5,
      max: 16,
    },

    home: {
      min: 8.0,
      max: 10.5,
    },

    lap: {
      min: 9.0,
      max: 12,
    },

    gold: {
      min: 9.0,
      max: 18,
    },

    "two-wheeler": {
      min: 9.5,
      max: 16,
    },

    business: {
      min: 11,
      max: 18,
    },
  } satisfies Record<string, RateBand>,

  fees: {
    personal: 2,
    home: 1,
    lap: 1,
    gold: 1,
    "two-wheeler": 2,
    business: 2,
  },

  tenure: {
    personal: 60,
    home: 240,
    lap: 180,
    gold: 36,
    "two-wheeler": 60,
    business: 60,
  },

  stress: {
    incomeDropPercent: 20,
  },

  confidence: {
    minimumAnsweredQuestions: 10,
  },
} as const