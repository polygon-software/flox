/**
 * This file contains all helper functions for handling strings
 */

/**
 * Converts a string to pascal case
 * @param {string} text The string you want to convert.
 * @returns {string} - The string in pascal case
 */
export function toPascalCase(text: string): string {
  return text.replace(/(\w)(\w*)/g, (g0: string, g1: string, g2: string) => {
    return g1.toUpperCase() + g2.toLowerCase();});
}
