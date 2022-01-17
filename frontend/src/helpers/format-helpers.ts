import { date } from 'quasar'

/**
 * This file contains helper functions for formatting content in a user-friendly way
 */

/**
 * Formats a date to a string in 01.12.2020 format. Internally, uses Quasar's date formatters
 * @param {Date|string} inputDate - the date or date string to format
 * @returns {string} - the formatted date
 */
export function formatDate(inputDate: Date|string): string{
  let actualDate

  if(typeof inputDate === 'string'){
    actualDate = new Date(inputDate)
  } else{
    actualDate = inputDate
  }

  return date.formatDate(actualDate, 'DD.MM.YYYY')
}

/**
 * Parses a string in 01.12.2020 format to a date. Internally, uses Quasar's date extractDate
 * @param {string} inputString - the date string to parse
 * @returns {Date} - the parsed date
 */
export function parseDate(inputString: string): Date{
  return date.extractDate(inputString, 'DD.MM.YYYY')
}

/**
 * Formats a date to a string in 01.12.2020, 14:23 format
 * @param {Date|string} inputDate - the date or date string to format
 * @returns {string} - the formatted date
 */
export function formatDateTime(inputDate: Date|string): string{
  let actualDate

  if(typeof inputDate === 'string'){
    actualDate = new Date(inputDate)
  } else{
    actualDate = inputDate
  }

  return date.formatDate(actualDate, 'DD.MM.YYYY HH:mm')
}
