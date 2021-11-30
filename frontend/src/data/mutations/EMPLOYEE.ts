import gql from 'graphql-tag';
import {MutationTypes} from 'src/data/DATA-DEFINITIONS';

export const CREATE_EMPLOYEE = {
  mutation: gql`
    mutation createEmployee($first_name: String!, $last_name: String!, $gender: String!, $phone: String!, $email: String!, $function: String!, $language: String!, $cognito_id: String!){
      createEmployee (createEmployeeInput: {first_name: $first_name, last_name: $last_name, gender: $gender, phone: $phone, email: $email, function: $function, language: $language, cognito_id: $cognito_id}) {
        uuid
        first_name
        last_name
        gender
        phone
        email
        function
        language
        cognito_id
        __typename
      }
    }`,
  tables: ['employee'],
  type: MutationTypes.CREATE,
  cacheLocation: 'createEmployee'
}
