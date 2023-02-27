import {calculateAge, dateToInputString} from 'src/helpers/format/date-helpers';

describe('Date Helpers', () => {
  let birthday: Date
  let date_one_year_one_day_ago: Date
  let date_not_full_one_year: Date
  beforeEach(() => {
    birthday = new Date('2014-01-31T00:00:00.000Z')
    date_one_year_one_day_ago = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    date_one_year_one_day_ago.setDate(date_one_year_one_day_ago.getDate() - 1)
    date_not_full_one_year = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    date_not_full_one_year.setDate(date_not_full_one_year.getDate() + 1)
  })
  describe('calculated age', () => {
    it('should return the age given his/her birthday', () => {
      expect(calculateAge(date_one_year_one_day_ago)).toEqual(1)
      expect(calculateAge(date_not_full_one_year)).toEqual(0)
    });
  });
  describe('returned date in string format', () => {
    it('should return a date as an string in format (YYYY-MM-DD)', () => {
      expect(dateToInputString(birthday)).toStrictEqual('2014-01-31')
      expect(dateToInputString(date_one_year_one_day_ago)).toStrictEqual(date_one_year_one_day_ago.getFullYear().toString() + '-' + ('0' + (date_one_year_one_day_ago.getMonth() + 1).toString()).slice(-2) + '-' + ('0' + date_one_year_one_day_ago.getDate().toString()).slice(-2))
    });
  })
});
