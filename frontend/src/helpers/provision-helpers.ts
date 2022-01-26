/**
 * This file contains all helper functions related to provision calculations
 */

/**
 * Returns the provision factor for a company depending on its total volume
 * @param {number} volume - total mortgage volume
 * @returns {number} - provision factor, between 0.6 and 0.76
 */
export function getProvisionFactor(volume: number){
  if(volume >= 15000000){
    return 0.75
  } else if(volume >= 8000000){
    return 0.7
  } else if(volume >= 4000000){
    return 0.65
  }

  return 0.6
}

/**
 * Calculates the total provision amount for a given dossier (which is later split between SOI and company)
 * @param {Record<string, unknown>} dossier - the dossier
 * @returns {number} - total provision amount
 */
export function getProvisionForDossier(dossier: Record<string, unknown>){

}
