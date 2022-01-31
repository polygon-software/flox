import {deepFilter, tableFilter} from "src/helpers/filter-helpers";

describe('Filter Helpers', () => {
  describe('return whether a string is present in a sentence of one string', () => {
    it('string is that string in a sentence', () => {
      expect(deepFilter("hallo", "hallo")).toBe(true)
    });
    it('string is not that string in a sentence', () => {
      expect(deepFilter("hallo", "hello")).toBe(false)
    });
  });

  describe('return whether a string is present in a sentence of type Date', () => {
    it('string is present in a sentence', () => {
      expect(deepFilter(new Date(1643620313943), "31.01.2022")).toBe(true)
    });
    it('string is not present in a sentence', () => {
      expect(deepFilter(new Date(1643620313943), "30.01.2022")).toBe(false)
    });
  });

  describe('return whether a string is present in a sentence of type Boolean', () => {
    it('string is present in a sentence', () => {
      expect(deepFilter(true, "true")).toBe(true)
    });
    it('string is not present in a sentence', () => {
      expect(deepFilter(true, "false")).toBe(false)
    });
  });

  describe('return whether a string is present in a sentence of type Number', () => {
    it('string is present in a sentence', () => {
      expect(deepFilter(6, "6")).toBe(true)
    });
    it('string is not present in a sentence', () => {
      expect(deepFilter(6, "6.5")).toBe(false)
    });
  });


  describe('return whether a string is present in a sentence of type String', () => {
    it('string is present in a sentence', () => {
      expect(deepFilter("Hallo ich bin", "Hallo")).toBe(true)
    });
    it('string is not present in a sentence', () => {
      expect(deepFilter("Hallo ich bin", "Hello")).toBe(false)
    });
  });

  describe('return whether a string is present in a sentence of type String with different upper-lowercase', () => {
    it('string is present in a sentence', () => {
      expect(deepFilter("Hallo ich bin", "hallo")).toBe(true)
      expect(deepFilter("HaLLo ich bin", "hallo")).toBe(true)
    });
    it('string is not present in a sentence', () => {
      expect(deepFilter("Hallo ich bin", "hello")).toBe(false)
    });
  });

  describe('return whether a string is present in a sentence with depthLimit 0', () => {
    it('string is present in a sentence with depthLimit 5', () => {
      expect(deepFilter(['hallo ich bin'], "hallo", 5)).toBe(true)
    });
    it('string is present in a sentence but with depthLimit 0', () => {
      expect(deepFilter(['hallo ich bin'], "hallo", 0)).toBe(false)
    });
  });

  describe('return whether a string is present in a sentence of type Array', () => {
    it('string is present in a sentence', () => {
      expect(deepFilter(['hallo ich bin'], "hallo")).toBe(true)
    });
    it('string is not present in a sentence', () => {
      expect(deepFilter(['hallo ich bin'], "hello")).toBe(false)
    });
  });

  describe('return whether a string is present in a sentence of type Object', () => {
    it('string is present in a sentence', () => {
      expect(deepFilter({ age: 40, first_name: 'Dickerson', last_name: 'Macdonald' }, "Macdonald")).toBe(true)
    });
    it('string is not present in a sentence', () => {
      expect(deepFilter({ age: 40, first_name: 'Dickerson', last_name: 'Macdonald' }, "Mcdonald")).toBe(false)
    });
    it('string is not present in empty sentence', () => {
      expect(deepFilter({}, "Macdonald")).toBe(false)
    });
  });

  describe('return row of a table in which a string is present', () => {
    it('string is present in a table', () => {
      const table = [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
        { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
        { age: 38, first_name: 'Jami', last_name: 'Carney' }
      ]
      expect(tableFilter(table, "Dickerson")).toStrictEqual([{ age: 40, first_name: 'Dickerson', last_name: 'Macdonald' }])
      expect(tableFilter(table, "Geneva")).toStrictEqual([{ age: 89, first_name: 'Geneva', last_name: 'Wilson' }])
    });
    it('string is not present in a table', () => {
      const table = [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
        { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
        { age: 38, first_name: 'Jami', last_name: 'Carney' }
      ]
      expect(tableFilter(table, "hallo")).toStrictEqual([])
    });
  });
});
