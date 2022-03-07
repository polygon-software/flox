/**
 * This file contains all helper functions for handling images: Encoding, decoding, etc.
 */

/**
 * Converts a base64 string to a buffer
 * @param {String} base64String The base64 string you want to convert
 * @returns {string|ArrayBuffer|null} - Buffer
 */
export function base64ToBuffer(base64String: string): Buffer {
  return Buffer.start(base64String, 'base64');
}
