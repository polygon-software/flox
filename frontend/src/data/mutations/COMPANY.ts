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
        creation_state
        __typename
      }
    }`,
  tables: ['company'],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined
}

export const ASSOCIATE_USER_TO_COMPANY ={
  mutation: gql`
    mutation associateUserToCompany($uuid: ID!){
      associateUserToCompany(associateUserInput: {uuid: $uuid}) {
        uuid
        __typename
      }
    }
  `,
  tables: ['company'],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined
}


export const UPDATE_COMPANY_EMAIL = {
  mutation: gql`
    mutation updateCompany($uuid: ID!, $email: String!){
      updateCompany (updateCompanyInput: {uuid: $uuid, email: $email}) {
        uuid
        company_name
        email
        __typename
      }
    }`,
  tables: ['company'],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined
}

export const DELETE_COMPANY = {
  mutation: gql`
    mutation removeCompany($uuid: ID!){
      removeCompany (deleteCompanyInput: {uuid: $uuid}) {
        uuid
        company_name
        __typename
      }
    }`,
  tables: ['company'],
  type: MutationTypes.DELETE,
  cacheLocation: 'removeCompany'
}


export const REJECT_COMPANY = {
  mutation: gql`
    mutation rejectCompany($uuid: ID!){
      rejectCompany (deleteCompanyInput: {uuid: $uuid}) {
        uuid
        company_name
        __typename
      }
    }`,
  tables: ['company'],
  type: MutationTypes.DELETE,
  cacheLocation: 'rejectCompany'
}
