import gql from 'graphql-tag';
import {MutationTypes} from 'src/data/DATA-DEFINITIONS';

export const CREATE_EMPLOYEE = {
  mutation: gql`
    mutation createEmployee($first_name: String!, $last_name: String!, $gender: String!, $phone: String!, $email: String!, $function: String!, $language: String!){
      createEmployee (createEmployeeInput: {first_name: $first_name, last_name: $last_name, gender: $gender, phone: $phone, email: $email, function: $function, language: $language}) {
        uuid
        first_name
        last_name
        gender
        phone
        email
        function
        language
        __typename
      }
    }`,
  tables: ['employee'],
  type: MutationTypes.CREATE,
  cacheLocation: 'createEmployee'
}

export const SET_COGNITO_EMPLOYEE = {
  mutation: gql`
    mutation updateEmployee($uuid: ID!, $cognito_id: String!){
      updateEmployee (updateEmployeeInput: {uuid: $uuid, cognito_id: $cognito_id}) {
        uuid
        email
        __typename
      }
    }`,
  tables: ['employee'],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined
}
