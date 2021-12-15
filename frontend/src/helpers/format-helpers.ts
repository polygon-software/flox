/**
 * This file contains helper functions for formatting content in a user-friendly way
 */

/**
 * Formats a date to a string in 01/12/2020 format
 * @param {Date} date - the date to format
 * @returns {string} - the formatted date
 */
export function formatDate(date: Date): string{
  return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
}
