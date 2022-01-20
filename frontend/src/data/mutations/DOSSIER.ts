import gql from 'graphql-tag';
import {MutationTypes} from 'src/data/DATA-DEFINITIONS';

export const CREATE_DOSSIER = {
  mutation: gql`
    mutation createDossier($createDossierInput: CreateDossierInput!){
      createDossier (createDossierInput: $createDossierInput) {
        uuid
        first_name
        last_name
        email
        phone
        birthdate
        address {
          uuid
          street
          number
          city
          zip_code
          __typename
        }
        original_bank {
          uuid
          abbreviation
          name
          __typename
        }
        non_arrangeable
        status
        employee {
          uuid
          __typename
        }
        final_document{
          uuid
          __typename
        }
        documents {
          uuid
          __typename
        }
        offers {
          uuid
          __typename
        }
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

export const SEND_DOSSIER_DOCUMENT_EMAIL = {
  mutation: gql`
    mutation sendDossierDocumentEmail($uuid: ID!, $recipients: [String!]!, $fileUuid: ID!){
      sendDossierDocumentEmail (sendDossierDocumentInput: {uuid: $uuid, recipients: $recipients, fileUuid: $fileUuid}) {
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
        first_name
        last_name
        email
        phone
        birthdate
        address {
          uuid
          street
          number
          city
          zip_code
          __typename
        }
        original_bank {
          uuid
          abbreviation
          name
          __typename
        }
        non_arrangeable
        status
        employee {
          uuid
          __typename
        }
        documents{
          uuid
          __typename
        }
        final_document{
          uuid
          __typename
        }
        __typename
        offers{
          __typename
          uuid
          status
        }
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
    mutation removeDossierFiles($uuid: ID!, $fileUuids: [ID!]!){
      removeDossierFiles(removeDossierFilesInput: {uuid: $uuid,fileUuids: $fileUuids}) {
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
