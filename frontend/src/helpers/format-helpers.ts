/**
 * This file contains helper functions for formatting content in a user-friendly way
 */

/**
 * Formats a date to a string in 01.12.2020 format
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

  return `${actualDate.getDate()}.${actualDate.getMonth()+1}.${actualDate.getFullYear()}`
}

/**
 * Formats a date to a string in 01.12.2020, 14:23 format
 * @param {Date|string} date - the date or date string to format
 * @returns {string} - the formatted date
 */
export function formatDateTime(date: Date|string): string{
  let actualDate

  if(typeof date === 'string'){
    actualDate = new Date(date)
  } else{
    actualDate = date
  }

  // Date string
  const dateString = `${actualDate.getDate()}.${actualDate.getMonth()+1}.${actualDate.getFullYear()}`

  // Time string
  const hour = actualDate.getHours()
  const minute = actualDate.getMinutes()
  const timeString = `${hour >= 10 ? '' : '0'}${hour}:${minute >= 10 ? '' : '0'}${minute}`

  return `${dateString}, ${timeString}`
}
