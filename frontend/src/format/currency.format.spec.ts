import { formatCurrency } from 'src/format/currency.format';

describe('Currency Helpers', () => {
  let amount: number | undefined;
  let currency: string | undefined;

  beforeEach(() => {
    amount = 100;
    currency = 'CHF';
  });

  describe('Formatted currency', () => {
    it(
      'should format the currency output according to' +
        ' the input with an empty space',
      () => {
        expect(formatCurrency(amount, currency)).toBe('100,00\u00a0CHF');
      }
    );
    it('should output large amounts in the correct format', () => {
      amount = 10000.5;
      expect(formatCurrency(amount, currency)).toBe('10.000,50\u00a0CHF');
    });
    it('should handle undefined amount inputs', () => {
      amount = undefined;
      expect(formatCurrency(amount, currency)).toBe('-');
    });
    it('should handle undefined currencies', () => {
      currency = undefined;
      expect(formatCurrency(amount, currency)).toBe('100,00\u00a0CHF');
    });
    it('should handle undefined currencies and amounts', () => {
      currency = undefined;
      amount = undefined;
      expect(formatCurrency(amount, currency)).toBe('-');
    });
  });
});
