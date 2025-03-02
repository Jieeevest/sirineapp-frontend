export function formatCurrency(
  amount: number,
  currencySymbol: string = "IDR"
): string {
  // Menggunakan toLocaleString untuk format mata uang lokal
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currencySymbol,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
