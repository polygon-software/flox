import { formatBytes } from 'src/format/number.format';

describe('Number Helpers', () => {
  let bytes: number;
  beforeEach(() => {
    bytes = 100;
  });

  describe('Formatted number', () => {
    it('format a number of bytes into a readable format', () => {
      expect(formatBytes(bytes)).toEqual('100 Bytes');
    });
    it('only return byte number when the number is positive', () => {
      bytes = 0;
      expect(formatBytes(bytes)).toEqual('0 Bytes');
    });
    it('return the correct prefix in steps of 1024 bytes', () => {
      expect(formatBytes(102400)).toEqual('100 KB');
      expect(formatBytes(104857600)).toEqual('100 MB');
      expect(formatBytes(107374182400)).toEqual('100 GB');
      expect(formatBytes(109951162777600)).toEqual('100 TB');
      expect(formatBytes(112589990684262400)).toEqual('100 PB');
      expect(formatBytes(115292150460684700000)).toEqual('100 EB');
      expect(formatBytes(118059162071741130342400)).toEqual('100 ZB');
      expect(formatBytes(120892581961462917470617600)).toEqual('100 YB');
    });
  });
});
