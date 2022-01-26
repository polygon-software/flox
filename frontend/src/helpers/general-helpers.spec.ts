import {sleep} from "src/helpers/general-helpers";

describe('General Helpers', () => {
  describe('time to wait', () => {
    it('should return the time in ms to wait', () => {
      expect(sleep()).toBeLessThanOrEqual(100)
    });
  });
});
