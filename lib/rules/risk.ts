import type { BorrowerProfile } from "@/types/borrower"

export function getRiskFlags(
  profile: BorrowerProfile
): string[] {
  const flags: string[] = []

  if (
    profile.recentBounce === true
  ) {
    flags.push(
      "Recent EMI bounce"
    )
  }

  if (
    profile.existingEMI &&
    profile.monthlyIncome &&
    profile.existingEMI /
      profile.monthlyIncome > 0.35
  ) {
    flags.push(
      "Existing debt burden is already high"
    )
  }

  if (
    profile.incomeStability ===
    "highly-variable"
  ) {
    flags.push(
      "Highly variable income"
    )
  }

  if (
    profile.creditScoreKnown === false
  ) {
    flags.push(
      "Credit score unknown"
    )
  }

  if (
    profile.emergencySavingsMonths === 0
  ) {
    flags.push(
      "No emergency savings"
    )
  }

  return flags
}