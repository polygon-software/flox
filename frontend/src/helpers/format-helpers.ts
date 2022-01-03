/**
 * This file contains helper functions for formatting content in a user-friendly way
 */

/**
 * Formats a date to a string in 01/12/2020 format
 * @param {Date|string} date - the date or date string to format
 * @returns {string} - the formatted date
 */
export function formatDate(date: Date|string): string{
  let actualDate

  if(typeof date === 'string'){
    actualDate = new Date(date)
  } else{
    actualDate = date
  }

  return `${actualDate.getDate()}/${actualDate.getMonth()+1}/${actualDate.getFullYear()}`
}
