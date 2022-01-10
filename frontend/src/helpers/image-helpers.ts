/**
 * This file contains all helper functions for handling images: Encoding, decoding, etc.
 */

/**
 * Converts a file to a data url
 * @param {File} file The file you want to convert.
 * @returns {string|ArrayBuffer|null} - the data URL for the file
 */
export async function toDataUrl(file: File): Promise<string|ArrayBuffer|null> {
  return await readFile(file)
}

/**
 * Covert a file to a data base64
 * @param {File} file The file you want to convert.
 * @returns {Promise<string>} - the data URL for the file
 */
export async function toBase64(file: File): Promise<string> {
  const dataURL = await readFile(file)
  if (!dataURL) {
    throw new Error('Error when converting picture')
  }

  const dataString = dataURL.toString()
  return dataString.slice(23, dataString.length)
}

/**
 * Helper function to call FileReader
 * @param {File} file The file to convert
 * @return {Promise<string|ArrayBuffer|null>} Data url
 */
function readFile(file: File): Promise<string|ArrayBuffer|null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  })
}
