/**
 * This file contains all helper functions pertaining to dates
 */

import {date} from 'quasar';
import endOfMonth from 'date-fns/endOfMonth'

/**
 * Calculates the age of a person with a given birth datee
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

/**
 * Returns the start and end date of the current quarter
 * Quarters: Jan - Mar, Apr - Jun, Jul - Sept, Oct - Dec
 * @returns {Array<Date>} - start date and end date in an array
 */
export function getCurrentQuarter(): Array<Date> {
  const today = new Date()
  const currentQuarter = Math.floor((today.getMonth() + 3) / 3) - 1
  const quarterBeginn = new Date(today.getFullYear(), currentQuarter * 3, 1)
  const quarterEnd = endOfMonth(new Date(today.getFullYear(), currentQuarter * 3 + 3, today.getDate()))
  return [quarterBeginn, quarterEnd]
}
