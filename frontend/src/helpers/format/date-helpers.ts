import { date } from 'quasar';

/**
 * This file contains all helper functions pertaining to dates
 */

/**
 * Calculates the age of a person with a given birth date
 * @param {date} birthDate - birthday to calculate from
 * @returns {number} - age in full years
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Converts a date to the input string format (YYYY-MM-DD)
 * @param {date} inputDate - date to convert
 * @returns {string} - date input string
 */
export function dateToInputString(inputDate: Date): string {
  return date.formatDate(inputDate, 'YYYY-MM-DD')
}
