import {
  calculateAge,
  dateToISOString,
  formatDate,
  formatDateTime,
} from 'src/format/date.format';

describe('Date Helpers', () => {
  let birthday: Date;
  let dateOneYearOneDayAgo: Date;
  let dateNotFullOneYear: Date;
  beforeEach(() => {
    birthday = new Date('2014-01-31T00:00:00.000Z');
    dateOneYearOneDayAgo = new Date(
      new Date().setFullYear(new Date().getFullYear() - 1)
    );
    dateOneYearOneDayAgo.setDate(dateOneYearOneDayAgo.getDate() - 1);
    dateNotFullOneYear = new Date(
      new Date().setFullYear(new Date().getFullYear() - 1)
    );
    dateNotFullOneYear.setDate(dateNotFullOneYear.getDate() + 1);
  });
  describe('calculated age', () => {
    it('should return the age given his/her birthday', () => {
      expect(calculateAge(dateOneYearOneDayAgo)).toEqual(1);
      expect(calculateAge(dateNotFullOneYear)).toEqual(0);
    });
  });
  describe('returned date in string format', () => {
    it('should return a date as an string in format (YYYY-MM-DD)', () => {
      const monthStr = (dateOneYearOneDayAgo.getMonth() + 1).toString();
      const monthSlice = dateOneYearOneDayAgo.getDate().toString();
      expect(dateToISOString(birthday)).toStrictEqual('2014-01-31');
      expect(dateToISOString(dateOneYearOneDayAgo)).toStrictEqual(
        `${dateOneYearOneDayAgo
          .getFullYear()
          .toString()}-${`0${monthStr}`.slice(-2)}-${`0${monthSlice}`.slice(
          -2
        )}`
      );
    });
  });
});

describe('Format Helpers', () => {
  let dateAsString: string;
  let date: Date;
  let dateWithTime: Date;
  let dateWithTimeAsString: string;
  beforeEach(() => {
    dateAsString = '2014-01-31T00:00:00.000Z';
    date = new Date(dateAsString);
    dateWithTime = new Date();
    dateWithTime.setFullYear(2014);
    dateWithTime.setMonth(0);
    dateWithTime.setDate(31);
    dateWithTime.setHours(12);
    dateWithTime.setMinutes(0);
    dateWithTimeAsString = dateWithTime.toString();
  });
  describe('formatDate in format "DD.MM.YYYY"', () => {
    it('should return date in right format', () => {
      expect(formatDate(date)).toStrictEqual('31.01.2014');
      expect(formatDate(dateAsString)).toStrictEqual('31.01.2014');
    });
  });
  describe('formatDateTime in format "DD.MM.YYYY hh:mm"', () => {
    it('should return date in right format', () => {
      expect(formatDateTime(dateWithTime)).toStrictEqual('31.01.2014 12:00');
      expect(formatDateTime(dateWithTimeAsString)).toStrictEqual(
        '31.01.2014 12:00'
      );
    });
  });
});
