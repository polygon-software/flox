import {formatDate, formatDateTime} from 'src/helpers/format-helpers';

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
