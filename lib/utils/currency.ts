const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formats a numeric price into a clean Nigerian Naira string.
 * e.g. formatNaira(25000) -> "₦25,000"
 */
export function formatNaira(amount: number): string {
  return nairaFormatter.format(amount);
}
