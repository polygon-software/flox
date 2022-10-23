import { toBase64 } from 'src/flox/modules/image/tools/base64.tools';

describe('ImageFile Helpers', () => {
  describe('converting image file', () => {
    it('should throw en error if no image file', () => {
      expect(() => toBase64(new File([], 'empty_file'))).toThrow(
        'File is not defined'
      );
    });
  });
});
