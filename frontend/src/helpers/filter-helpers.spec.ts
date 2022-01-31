import {deepFilter, tableFilter} from 'src/helpers/filter-helpers';

describe('Filter Helpers', () => {
  describe('string is present in a given sentence', () => {
    it('should return whether a string is present in a sentence of one word', () => {
      expect(deepFilter('hallo', 'hallo')).toBe(true)
      expect(deepFilter('hallo', 'hello')).toBe(false)
    });
    it('should return whether a string is present in a sentence of type Date', () => {
      expect(deepFilter(new Date(1643620313943), '31.01.2022')).toBe(true)
      expect(deepFilter(new Date(1643620313943), '30.01.2022')).toBe(false)
    });
    it('should return whether a string is present in a sentence of type Boolean', () => {
      expect(deepFilter(true, 'true')).toBe(true)
      expect(deepFilter(true, 'false')).toBe(false)
    });
    it('should return whether a string is present in a sentence of type Number', () => {
      expect(deepFilter(6, '6')).toBe(true)
      expect(deepFilter(6, '6.5')).toBe(false)
    });
    it('should return whether a string is present in a sentence of type String with different upper-lowercase', () => {
      expect(deepFilter('Hallo ich bin', 'Hallo')).toBe(true)
      expect(deepFilter('Hallo ich bin', 'hallo')).toBe(true)
      expect(deepFilter('HALLO ICH BIN', 'hallo')).toBe(true)
      expect(deepFilter('Hallo ich bin', 'Hello')).toBe(false)
      expect(deepFilter('Hallo ich bin', 'hello')).toBe(false)
    });
    it('should return whether a string is present in a sentence with different depthLimits', () => {
      expect(deepFilter(['hallo ich bin'], 'hallo', 5)).toBe(true)
      expect(deepFilter(['hallo ich bin'], 'hallo', 0)).toBe(false)
    });
    it('should return whether a string is present in a sentence of type Array', () => {
      expect(deepFilter(['hallo ich bin'], 'hallo')).toBe(true)
      expect(deepFilter(['HALLO ICH BIN'], 'hallo')).toBe(true)
      expect(deepFilter(['hallo ich bin'], 'hello')).toBe(false)
    });
    it('should return whether a string is present in a sentence of type Object', () => {
      expect(deepFilter({ age: 40, first_name: 'Dickerson', last_name: 'Macdonald' }, 'Macdonald')).toBe(true)
      expect(deepFilter({ age: 40, first_name: 'Dickerson', last_name: 'Macdonald' }, 'Mcdonald')).toBe(false)
    });
    it('should return false if empty sentence', () => {
      expect(deepFilter('', 'Macdonald')).toBe(false)
      expect(deepFilter({}, 'Macdonald')).toBe(false)
    });
  });

  describe('tableFilter', () => {
    it('should return row of a table in which a string is present in that table', () => {
      const table = [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
        { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
        { age: 38, first_name: 'Jami', last_name: 'Carney' }
      ]
      expect(tableFilter(table, 'Dickerson')).toStrictEqual([{ age: 40, first_name: 'Dickerson', last_name: 'Macdonald' }])
      expect(tableFilter(table, 'Geneva')).toStrictEqual([{ age: 89, first_name: 'Geneva', last_name: 'Wilson' }])
      expect(tableFilter(table, 'hallo')).toStrictEqual([])
    });
  });
});
