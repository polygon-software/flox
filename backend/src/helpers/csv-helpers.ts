import { parse } from 'csv-parse';

/**
 * This file contains all helper functions related to handling CSV files
 */

/**
 * Parses a CSV file to an object
 * @param {Buffer} fileBuffer - CSV file as buffer
 * @returns {Record<string, unknown>[]} - converted object
 */
export function parseCsv(fileBuffer: Buffer) {
  // Parse input as string
  parse(
    fileBuffer.toString(),
    {
      delimiter: '\t', // Tab is default separator
      columns: true, // Auto-discover column names from first CSV line
    },
    (error, result: Record<string, unknown>[]) => {
      if (error) {
        throw error;
      }

      return result;
    },
  );
}
