import { parse } from 'csv-parse';

/**
 * This file contains all helper functions related to handling CSV files
 */

/**
 * Parses a CSV file to an object array, getting column names from the first row
 * @param {Buffer} fileBuffer - CSV file as buffer
 * @param {string} [delimiter] - value separator, default is tab (\t)
 * @returns {Promise<Record<string, string>[]>} - CSV file converted to object
 */
export async function parseCsv(fileBuffer: Buffer, delimiter = '\t') {
  // Parse input as string
  return new Promise(async (resolve, reject) => {
    parse(
      fileBuffer.toString(),
      {
        delimiter: delimiter, // Value separator
        columns: true, // Auto-discover column names from first CSV line
      },
      (error, result: Record<string, string>[]) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      },
    );
  });
}
