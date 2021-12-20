import gql from 'graphql-tag';
import {MutationTypes} from 'src/data/DATA-DEFINITIONS';

export const CREATE_SOI_EMPLOYEE = {
  mutation: gql`
    mutation createSoiEmployee($first_name: String!, $last_name: String!, $gender: String!, $phone: String!, $email: String!){
      createSoiEmployee (createSoiEmployeeInput: {first_name: $first_name, last_name: $last_name, gender: $gender, phone: $phone, email: $email}) {
        uuid
        first_name
        last_name
        gender
        phone
        email
        __typename
      }
    }`,
  tables: ['soiemployee'],
  type: MutationTypes.CREATE,
  cacheLocation: 'createSOIEmployee'
}
