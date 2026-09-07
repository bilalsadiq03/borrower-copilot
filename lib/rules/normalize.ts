export function isAffirmative(
  value: unknown
): boolean {
  return (
    value === true ||
    value === "yes" ||
    value === "true"
  )
}

export function isNegative(
  value: unknown
): boolean {
  return (
    value === false ||
    value === "no" ||
    value === "false"
  )
}

export function toNumberValue(
  value: unknown
): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value)

    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return undefined
}
