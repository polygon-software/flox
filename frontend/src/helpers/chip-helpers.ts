/**
 * Contains all functions related to styling/filling <q-chip>s
 */

import {DOSSIER_STATUS, OFFER_STATUS} from 'src/data/ENUM/ENUM';

/**
 * ToDo Fix colors
 * Get style parameter for dossier status chip
 * @param  {DOSSIER_STATUS} status - status of dossier
 * @returns {string} - style
 */
export function dossierChipStyle(status: DOSSIER_STATUS){
  const color = 'color: white; background-color: '

  switch (status) {
    case DOSSIER_STATUS.OPEN:
      return color + '#58ACFA;'
    case DOSSIER_STATUS.SIGNED:
      return color + '#52130A;'
    case DOSSIER_STATUS.REJECTED:
      return color + '#A82CF0;'
    case DOSSIER_STATUS.SUBMITTED:
      return color + '#4126F9;'
    case DOSSIER_STATUS.OFFERED:
      return color + '#378F23;'
    case DOSSIER_STATUS.COMPLETED:
      return color + '#1FB06C;'
    case  DOSSIER_STATUS.IN_PROGRESS:
      return color + '#A22736;'
    case DOSSIER_STATUS.SENT:
      return color + '#F829F3;'
    case DOSSIER_STATUS.CONTRACT_UPLOADED:
      return color + '#15B034;'
    case DOSSIER_STATUS.PRODUCT_AGREEMENT_CONFIRMED:
      return color + '#00DE2C;'
  }
  return color + '#000000;'
}

/**
 * Get style parameter for offer status chip
 * @param  {OFFER_STATUS} status - status of offer
 * @returns {string} - style
 */
export function offerChipStyle(status: OFFER_STATUS){
  const color = 'color: white; background-color: '
  switch (status) {
    case OFFER_STATUS.INTERESTED:
      return color + '#f0b000;'
    case OFFER_STATUS.IN_PROCESS:
      return color + '#040f85;'
    case OFFER_STATUS.RETRACTED:
      return color + '#c92002;'
    case OFFER_STATUS.ACCEPTED:
      return color + '#16630a;'
  }
  return color + '#000000;'
}
