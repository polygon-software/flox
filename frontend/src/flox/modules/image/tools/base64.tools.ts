/**
 * This file contains all helper functions for handling images: Encoding, decoding, etc.
 */

/**
 * Converts a file to a data URL using file reader
 *
 * @param file - The file to convert
 * @returns Data URL of the file
 */
export async function toDataUrl(
  file: File
): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (): void => resolve(reader.result);
    reader.onerror = (error): void => reject(error);
  });
}

/**
 * Convert a file to a data base64
 *
 * @param file - The file you want to convert.
 * @returns the data URL for the file
 */
export async function toBase64(file: File): Promise<string> {
  const dataURL = await toDataUrl(file);
  if (!dataURL) {
    throw new Error('Error when converting picture');
  }

  const dataString = dataURL.toString();
  return dataString.slice(23, dataString.length);
}
