import {calculateAge, dateToInputString, formatDate, formatDateTime} from 'src/format/date.format';

describe('Date Helpers', () => {
  let birthday: Date
  let date_one_year_one_day_ago: Date
  let date_not_full_one_year: Date
  beforeEach( () => {
    birthday = new Date('2014-01-31T00:00:00.000Z')
    date_one_year_one_day_ago = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    date_one_year_one_day_ago.setDate(date_one_year_one_day_ago.getDate() - 1)
    date_not_full_one_year = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    date_not_full_one_year.setDate(date_not_full_one_year.getDate() + 1)
  })
  describe('calculated age', () => {
    it('should return the age given his/her birthday', () => {
      expect(calculateAge(birthday)).toEqual(8)
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

describe('Format Helpers', () => {
  let date_as_string: string
  let date: Date
  let date_with_time: Date
  let date_with_time_as_string: string
  beforeEach( () => {
    date_as_string = '2014-01-31T00:00:00.000Z'
    date = new Date(date_as_string)
    date_with_time = new Date()
    date_with_time.setFullYear(2014)
    date_with_time.setMonth(0)
    date_with_time.setDate(31)
    date_with_time.setHours(12)
    date_with_time.setMinutes(0)
    date_with_time_as_string = date_with_time.toString()

  })
  describe('formatDate in format "DD.MM.YYYY"', () => {
    it('should return date in right format', () => {
      expect(formatDate(date)).toStrictEqual('31.01.2014')
      expect(formatDate(date_as_string)).toStrictEqual('31.01.2014')
    });
  });
  describe('formatDateTime in format "DD.MM.YYYY hh:mm"', () => {
    it('should return date in right format', () => {
      expect(formatDateTime(date_with_time)).toStrictEqual('31.01.2014 12:00')
      expect(formatDateTime(date_with_time_as_string)).toStrictEqual('31.01.2014 12:00')
    });
  });
});
