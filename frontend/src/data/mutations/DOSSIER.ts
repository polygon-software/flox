import gql from 'graphql-tag';
import {MutationTypes} from 'src/data/DATA-DEFINITIONS';

export const CREATE_DOSSIER = {
  mutation: gql`
    mutation createDossier($first_name: String!, $last_name: String!, $uid: String, $correspondence_address: CreateAddressInput!, $email: String!, $original_bank: Bank!, $born: DateTime!, $property_address: CreateAddressInput!, $loan_sum: Int!, $non_arrangeable: Boolean!, $status: Status!, $offers: Array!){
      createDossier (createDossierInput: {first_name: $first_name, last_name: $last_name, uid: $uid, correspondence_address: $correspondence_address, email: $email, original_bank: $original_bank, born: $born, property_address: $property_address, loan_sum: $loan_sum, non_arrangeable: $non_arrangeable, status: $status, offers: $offers}) {
        uuid
        correspondence_address
        original_bank
        born
        property_address
        loan_sum
        non_arrangeable
        status
        offers
        __typename
      }
    }`,
  tables: ['dossier'],
  type: MutationTypes.CREATE,
  cacheLocation: 'createDossier'
}

/**
 * todo: after the table exists, compare it and change it like it is in the table
 */
export const SET_DOSSIER_STATUS = {
  mutation: gql`
    mutation updateDossierStatus($first_name: String!, $last_name: String!, $uid: String, $correspondence_address: CreateAddressInput!, $email: String!, $original_bank: Bank!, $born: DateTime!, $property_address: CreateAddressInput!, $loan_sum: Int!, $non_arrangeable: Boolean!, $status: Status!, $offers: Array!){
      updateDossierStatus (updateDossierStatusInput: {first_name: $first_name, last_name: $last_name, uid: $uid, correspondence_address: $correspondence_address, email: $email, original_bank: $original_bank, born: $born, property_address: $property_address, loan_sum: $loan_sum, non_arrangeable: $non_arrangeable, status: $status, offers: $offers}) {
        uuid
        status
        __typename
      }
    }`,
  tables: ['dossier'],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined
}
