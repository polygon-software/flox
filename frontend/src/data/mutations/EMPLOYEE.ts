import gql from 'graphql-tag';
import {MutationTypes} from 'src/data/DATA-DEFINITIONS';

export const CREATE_EMPLOYEE = {
  mutation: gql`
    mutation createEmployee($first_name: String!, $last_name: String!, $gender: String!, $phone: String!, $email: String!){
      createEmployee (createEmployeeInput: {first_name: $first_name, last_name: $last_name, gender: $gender, phone: $phone, email: $email}) {
        uuid
        first_name
        last_name
        __typename
      }
    }`,
  tables: ['company'],
  type: MutationTypes.CREATE,
  cacheLocation: 'createCompany'
}
