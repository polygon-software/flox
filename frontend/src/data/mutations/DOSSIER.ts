import gql from 'graphql-tag';
import {MutationTypes} from 'src/data/DATA-DEFINITIONS';

export const CREATE_DOSSIER = {
  mutation: gql`
    mutation createDossier($first_name: String!, $last_name: String!, $correspondence_address: CreateAddressInput!, $email: String!, $original_bank_name: String!, $original_bank_abbreviation: String!, $born: DateTime!, $property_address: CreateAddressInput!, $loan_sum: Float!){
      createDossier (createDossierInput: {first_name: $first_name, last_name: $last_name, correspondence_address: $correspondence_address, email: $email, original_bank_name: $original_bank_name,original_bank_abbreviation: $original_bank_abbreviation, born: $born, property_address: $property_address, loan_sum: $loan_sum}) {
        uuid
        correspondence_address {
          uuid
          street
          number
          city
          zip_code
          __typename
        }
        original_bank {
          uuid
          __typename
        }
        born
        property_address {
          uuid
          street
          number
          city
          zip_code
          __typename
        }
        loan_sum
        non_arrangeable
        status
        __typename
      }
    }`,
  tables: ['dossier'],
  type: MutationTypes.CREATE,
  cacheLocation: 'createDossier'
}

export const SET_DOSSIER_STATUS = {
  mutation: gql`
    mutation updateDossierStatus($uuid: ID!, $status: DossierStatus!){
      updateDossierStatus (updateDossierStatusInput: {uuid: $uuid, status: $status}) {
        uuid
        status
        __typename
      }
    }`,
  tables: ['dossier'],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined
}

export const RESET_DOSSIER = {
  mutation: gql`
    mutation resetDossier($uuid: ID!){
      resetDossier (resetDossierInput: {uuid: $uuid}) {
        uuid
        correspondence_address {
          uuid
          street
          number
          city
          zip_code
          __typename
        }
        original_bank {
          uuid
          __typename
        }
        born
        property_address {
          uuid
          street
          number
          city
          zip_code
          __typename
        }
        offers{
          __typename
          uuid
          status
        }
        loan_sum
        non_arrangeable
        status
        __typename
      }
    }`,
  tables: ['dossier'],
  type: MutationTypes.DELETE, // Is a delete, since offers are deleted
  cacheLocation: 'resetDossier'
}

export const CREATE_OFFER = {
  mutation: gql`
    mutation createOffer($bank_uuid: String!, $dossier_uuid: String!, $status: OfferStatus!){
      createOffer(createOfferInput: {bank_uuid: $bank_uuid, dossier_uuid:$dossier_uuid, status: $status}){
        uuid
        __typename
        offers{
          __typename
          uuid
          status
          bank{
            name
            abbreviation
            __typename
            uuid
          }
        }
      }
    }
    `,
  tables: ['dossier', 'offer'],
  type: MutationTypes.UPDATE,
  cacheLocation: 'createOffer'
}

export const SET_OFFER_STATUS = {
  mutation: gql`
    mutation updateOfferStatus($dossier_uuid: ID!, $offer_uuid: ID!, $status: OfferStatus!){
      updateOfferStatus (updateOfferStatusInput: {dossier_uuid: $dossier_uuid, offer_uuid: $offer_uuid, status: $status}) {
        uuid
        __typename
        offers{
            __typename
            uuid
            status
            bank{
                name
                abbreviation
                __typename
                uuid
            }
        }
      }
    }`,
  tables: ['dossier', 'offer'],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined
}

export const REMOVE_FILES_DOSSIER = {
  mutation: gql`
    mutation removeFiles($uuid: ID!, $fileUuids: [ID!]!){
      removeFiles(removeFilesDossierInput: {uuid: $uuid,fileUuids: $fileUuids}) {
        uuid
        __typename
        documents{
          uuid
          __typename
          key
          file_type
        }
      }
    }
  `,
  tables: ['dossier'],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined
}
