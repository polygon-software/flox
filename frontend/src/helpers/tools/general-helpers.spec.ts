import {sleep} from 'src/helpers/tools/general-helpers';

describe('General Helpers', () => {
  describe('time to wait', () => {
    it('should return that the time before and after calling sleep function is less than 150 ms and greater than 50 ms', async () => {
      const time_before_sleep_function = new Date()
      await sleep()
      const time_after_sleep_function = new Date()
      const difference_in_milliseconds = time_after_sleep_function.getMilliseconds() - time_before_sleep_function.getMilliseconds()
      expect(Math.abs(difference_in_milliseconds)).toBeLessThanOrEqual(150)
      expect(Math.abs(difference_in_milliseconds)).toBeGreaterThanOrEqual(50)
    });
    it('should return that the time before and after calling sleep function is less than 750 ms and greater than 250 ms', async () => {
      const time_before_sleep_function_2 = new Date()
      await sleep(500)
      const time_after_sleep_function_2 = new Date()
      const difference_in_milliseconds_2 = time_after_sleep_function_2.getMilliseconds() - time_before_sleep_function_2.getMilliseconds()
      expect(Math.abs(difference_in_milliseconds_2)).toBeLessThanOrEqual(750)
      expect(Math.abs(difference_in_milliseconds_2)).toBeGreaterThanOrEqual(250)
    });
  });
});
