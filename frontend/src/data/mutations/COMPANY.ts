import gql from 'graphql-tag';
import {MutationTypes} from 'src/data/DATA-DEFINITIONS';

export const CREATE_COMPANY = {
  mutation: gql`
    mutation createCompany($company_name: String!, $first_name: String!, $last_name: String!, $language: String!, $uid: String, $domicile_address: CreateAddressInput!, $correspondence_address: CreateAddressInput!, $phone: String!, $email: String!, $branch_structure: Boolean!){
      createCompany (createCompanyInput: {company_name: $company_name, first_name: $first_name, last_name: $last_name, language: $language, uid: $uid, domicile_address: $domicile_address, correspondence_address: $correspondence_address, phone: $phone, email: $email, branch_structure: $branch_structure}) {
        uuid
        company_name
        __typename
      }
    }`,
  tables: ['company'],
  type: MutationTypes.CREATE,
  cacheLocation: 'createCompany'
}

export const ENABLE_COMPANY_DOCUMENT_UPLOAD = {
  mutation: gql`
    mutation enableCompanyDocumentUpload($uuid: String!){
      enableCompanyDocumentUpload (uuid: $uuid) {
        uuid
        company_name
        document_upload_enabled
        __typename
      }
    }`,
  tables: ['company'],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined
}

export const SET_COGNITO_USER = {
  mutation: gql`
    mutation updateCompany($uuid: ID!, $cognito_id: String!){
      updateCompany (updateCompanyInput: {uuid: $uuid, cognito_id: $cognito_id}) {
        uuid
        company_name
        cognito_id
        __typename
      }
    }`,
  tables: ['company'],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined
}
