import { randomNumber, randomPassword } from 'src/tools/generator.tool';

describe('Generator Helpers', () => {
  describe('randomNumber', () => {
    it('should return a random number between 1 and 100', () => {
      const result = randomNumber();
      expect(result).toBeLessThanOrEqual(100);
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should return a random number in the given range', () => {
      const min = 10;
      const max = 30;
      const result = randomNumber(min, max);
      expect(result).toBeLessThanOrEqual(max);
      expect(result).toBeGreaterThanOrEqual(min);
    });
  });

  describe('randomPassword', () => {
    it('should return a random password of the given length', () => {
      const length = 8;
      const result = randomPassword(length);
      expect(result.length).toBe(length);
    });
  });
});
