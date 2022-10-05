import {toBase64} from 'src/helpers/tools/image-helpers';

describe('ImageFile Helpers', () => {
  describe('converting image file', () => {
    it('should throw en error if no image file', () => {
      expect(() => toBase64(new File([], 'empty_file'))).toThrow('S3File is not defined');
    });
  });
});
