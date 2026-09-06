export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}