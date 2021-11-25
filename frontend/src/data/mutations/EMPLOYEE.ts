import gql from 'graphql-tag';
import {MutationTypes} from 'src/data/DATA-DEFINITIONS';

export const CREATE_EMPLOYEE = {
  mutation: gql`
    mutation createEmployee($first_name: String!, $last_name: String!, $gender: String!, $phone: String!, $email: String!, $function: String!, $language: String!, $company: company!){
      createEmployee (createEmployeeInput: {first_name: $first_name, last_name: $last_name, gender: $gender, phone: $phone, email: $email, function: $function, language: $language, company: $company}) {
        uuid
        first_name
        last_name
        company{
          uuid
        }
        __typename
      }
    }`,
  tables: ['company'],
  type: MutationTypes.CREATE,
  cacheLocation: 'createCompany'
}
