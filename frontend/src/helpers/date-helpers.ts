/**
 * This file contains all helper functions pertaining to dates
 */

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
