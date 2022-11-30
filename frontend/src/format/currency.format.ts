/**
 *
 */
// eslint-disable-next-line import/prefer-default-export
export function formatCurrency(amount?: number, currency?: string): string {
  if (!amount) {
    return '-';
  }
  return Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: (currency ?? 'CHF').toUpperCase(),
  }).format(amount || 0);
}
