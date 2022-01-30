import {toBase64, toDataUrl} from "src/helpers/image-helpers";

describe('Image Helpers', () => {
  describe('converts files', () => {
    it('converted file is a string', () => {
      const file = ""
      expect(toBase64(file)).toBeInstanceOf(String)
    });
    it('converted file is a string or an array', () => {
      const file = ""
      expect(toDataUrl(file)).toBeInstanceOf(String)
    });
  });

});
