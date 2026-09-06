import type { BorrowerProfile } from "@/types/borrower"

export type ProductRoute =
  | "personal"
  | "home"
  | "secured-lap"
  | "gold"
  | "business"
  | "two-wheeler"
  | "review"

export function getRecommendedProductRoute(
  profile: BorrowerProfile
): ProductRoute {
  if (
    profile.employmentType === "self-employed" &&
    profile.hasCollateral === "yes" &&
    (profile.collateralValue ?? 0) > 0
  ) {
    return "secured-lap"
  }

  if (
    profile.employmentType === "informal" &&
    profile.loanType === "two-wheeler"
  ) {
    return "two-wheeler"
  }

  if (
    profile.loanType === "business"
  ) {
    return "business"
  }

  if (profile.loanType) {
    return profile.loanType === "lap"
      ? "secured-lap"
      : profile.loanType
  }

  return "review"
}