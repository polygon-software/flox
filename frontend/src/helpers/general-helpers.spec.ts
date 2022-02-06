import {sleep} from 'src/helpers/general-helpers';

describe('General Helpers', () => {
  describe('time to wait', () => {
    it('should return that the time before and after calling sleep function is less than 100 ms', () => {
      const time_before_sleep_function = new Date()
      void sleep()
      const time_after_sleep_function = new Date()
      const difference_in_milliseconds = time_after_sleep_function.getMilliseconds() - time_before_sleep_function.getMilliseconds()
      expect(difference_in_milliseconds).toBeCloseTo(0, 10)
    });
    it('should return that the time before and after calling sleep function is less than 500 ms', () => {
      const time_before_sleep_function_2 = new Date()
      void sleep(500)
      const time_after_sleep_function_2 = new Date()
      const difference_in_milliseconds_2 = time_after_sleep_function_2.getMilliseconds() - time_before_sleep_function_2.getMilliseconds()
      expect(difference_in_milliseconds_2).toBeCloseTo(0, 10)
    });
  });
});
