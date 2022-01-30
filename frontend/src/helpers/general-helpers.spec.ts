import {sleep} from "src/helpers/general-helpers";

describe('General Helpers', () => {
  describe('time to wait', () => {
    it('should return the time in ms to wait', () => {
      const time_before_sleep_function = new Date()
      sleep()
      const time_after_sleep_function = new Date()
      const difference_in_milliseconds = time_after_sleep_function.getMilliseconds() - time_before_sleep_function.getMilliseconds()
      expect(difference_in_milliseconds).toBeLessThanOrEqual(100)
    });
  });
});
