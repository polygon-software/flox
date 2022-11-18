/**
 * Formats a number of bytes into a readable format
 *
 * @param bytes - number of bytes
 * @example 32768 -> 23.0 KB
 * @returns nicely format number of bytes (KB, MB, GB etc.)
 */
// eslint-disable-next-line import/prefer-default-export
export function formatBytes(bytes: number): string {
  const decimals = 1;
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}
