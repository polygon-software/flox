import {toBase64} from 'src/helpers/tools/image-helpers';
import { expect } from '@jest/globals'


describe('Image Helpers', () => {
  describe('converting image file', () => {
    it('should throw en error if no image file', () => {
      expect(() => toBase64(new File([], 'empty_file'))).toThrow('File is not defined');
    });
  });
});
