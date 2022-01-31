import {formatDate, formatDateTime} from "src/helpers/format-helpers";

describe('Format Helpers', () => {
  let date: Date
  beforeEach( () => {
    date = new Date('2014-01-31T00:00:00.000Z')
  })
  describe('formatDate in format "DD.MM.YYYY"', () => {
    it('should return date in right format', () => {
      expect(formatDate(date)).toStrictEqual("31.01.2014")
      expect(formatDate('2014-01-31T00:00:00.000Z')).toStrictEqual("31.01.2014")
    });
    it('should not return date in wrong format', () => {
      expect(formatDate(date)).not.toStrictEqual("31.01.14")
    });
  });
  describe('formatDateTime in format "DD.MM.YYYY hh:mm"', () => {
    it('should return date in right format', () => {
      expect(formatDateTime(date)).toStrictEqual("31.01.2014 01:00")
      expect(formatDateTime('2014-01-31T00:00:00.000Z')).toStrictEqual("31.01.2014 01:00")
    });
    it('should not return date in wrong format', () => {
      expect(formatDateTime(date)).not.toStrictEqual("31.01.2014 01:000")
    });
  });
});
