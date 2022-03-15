/**
 * This file contains all device-related helper functions
 */

/**
 * Returns the device type associated with the client id
 * @param {string} clientId - the client id
 * @returns {'MR2000'|'MR3000'} - the device type
 */
export function deviceType(clientId: string) {
  return clientId.includes('-') ? 'MR2000' : 'MR3000';
}
