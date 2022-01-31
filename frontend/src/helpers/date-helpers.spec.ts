import {calculateAge, dateToInputString} from "src/helpers/date-helpers";

describe('Date Helpers', () => {
  describe('calculated age', () => {
    let birthday: Date
    beforeEach( () => {
      birthday = new Date('2014-01-31T00:00:00.000Z')
    })
    it('should return the age given his/her birthday', () => {
      expect(calculateAge(birthday)).toBeLessThanOrEqual(8)
      expect(calculateAge(birthday)).toBeGreaterThanOrEqual(0)
      expect(calculateAge(birthday)).not.toBeLessThanOrEqual(3)
      expect(calculateAge(birthday)).toEqual(expect.any(Number))
    });

    it('should return a date as an string in format (YYYY-MM-DD)', () => {
      expect(dateToInputString(birthday)).toStrictEqual('2014-01-31')
      expect(dateToInputString(birthday)).not.toStrictEqual('2013-01-31')
      expect(dateToInputString(birthday)).toEqual(expect.any(String))
    });
  });
});
