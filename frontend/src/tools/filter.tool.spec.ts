import { deepFilter, tableFilter } from 'src/tools/filter.tool';

describe('Filter Helpers', () => {
  let sentence: string;
  let sentenceWithOneUppercase: string;
  let sentenceUppercase: string;
  let hallo: string;
  beforeEach(() => {
    sentence = 'hallo ich bin';
    sentenceWithOneUppercase = 'Hallo ich bin';
    sentenceUppercase = 'HALLO ICH BIN';
    hallo = 'hallo';
  });
  describe('string is present in a given sentence', () => {
    it('should return whether a string is present in a sentence of one word', () => {
      expect(deepFilter(hallo, 'hallo')).toBe(true);
      expect(deepFilter(hallo, 'hello')).toBe(false);
    });
    it('should return whether a string is present in a sentence of type Date', () => {
      expect(deepFilter(new Date(1643620313943), '31.01.2022')).toBe(true);
      expect(deepFilter(new Date(1643620313943), '30.01.2022')).toBe(false);
    });
    it('should return whether a string is present in a sentence of type Boolean', () => {
      expect(deepFilter(true, 'true')).toBe(true);
      expect(deepFilter(true, 'false')).toBe(false);
    });
    it('should return whether a string is present in a sentence of type Number', () => {
      expect(deepFilter(6, '6')).toBe(true);
      expect(deepFilter(6, '6.5')).toBe(false);
      expect(deepFilter(6.5, '6')).toBe(true);
    });
    it('should return whether a string is present in a sentence of type String with different upper-lowercase', () => {
      expect(deepFilter(sentence, 'hallo')).toBe(true);
      expect(deepFilter(sentenceWithOneUppercase, 'Hallo')).toBe(true);
      expect(deepFilter(sentenceWithOneUppercase, 'hallo')).toBe(true);
      expect(deepFilter(sentenceUppercase, 'hallo')).toBe(true);
      expect(deepFilter(sentenceWithOneUppercase, 'Hello')).toBe(false);
      expect(deepFilter(sentence, 'hello')).toBe(false);
    });
    it('should return whether a string is present in a sentence with different depthLimits', () => {
      expect(deepFilter([sentence], 'hallo', 5)).toBe(true);
      expect(deepFilter([sentence], 'hallo', 0)).toBe(false);
    });
    it('should return whether a string is present in a sentence of type Array', () => {
      expect(deepFilter([sentence], 'hallo')).toBe(true);
      expect(deepFilter([sentenceUppercase], 'hallo')).toBe(true);
      expect(deepFilter(['monday', 'tuesday', sentence], 'hallo')).toBe(true);
      expect(deepFilter([sentence], 'hello')).toBe(false);
      expect(deepFilter(['monday', 'tuesday', sentence], 'hello')).toBe(false);
    });
    it('should return whether a string is present in a sentence of type Object', () => {
      expect(
        deepFilter(
          { age: 40, firstName: 'Dickerson', lastName: 'Macdonald' },
          'Macdonald'
        )
      ).toBe(true);
      expect(
        deepFilter(
          { age: 40, firstName: 'Dickerson', lastName: 'Macdonald' },
          'kerson'
        )
      ).toBe(true);
      expect(
        deepFilter(
          { age: 40, firstName: 'Dickerson', lastName: 'Macdonald' },
          'Mcdonald'
        )
      ).toBe(false);
      expect(
        deepFilter(
          { age: 40, firstName: 'Dickerson', lastName: 'Macdonald' },
          'karson'
        )
      ).toBe(false);
    });
    it('should return false if empty sentence', () => {
      expect(deepFilter('', 'Macdonald')).toBe(false);
      expect(deepFilter({}, 'Macdonald')).toBe(false);
    });
  });

  describe('tableFilter', () => {
    it('should return row of a table in which a string is present in that table', () => {
      const table = [
        { age: 40, firstName: 'Dickerson', lastName: 'Macdonald' },
        { age: 21, firstName: 'Larsen', lastName: 'Shaw' },
        { age: 89, firstName: 'Geneva', lastName: 'Wilson' },
        { age: 38, firstName: 'Jami', lastName: 'Carney' },
      ];
      expect(tableFilter(table, 'Dickerson')).toStrictEqual([
        { age: 40, firstName: 'Dickerson', lastName: 'Macdonald' },
      ]);
      expect(tableFilter(table, 'Geneva')).toStrictEqual([
        { age: 89, firstName: 'Geneva', lastName: 'Wilson' },
      ]);
      expect(tableFilter(table, 'hallo')).toStrictEqual([]);
    });
  });
});
