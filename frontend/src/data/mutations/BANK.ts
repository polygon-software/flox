import gql from 'graphql-tag';
import {MutationTypes} from 'src/data/DATA-DEFINITIONS';

export const CREATE_BANK = {
  mutation: gql`
    mutation createBank($first_name: String!, $last_name: String!, $address: CreateAddressInput!, $email: String!){
      createBank (createBankInput: {first_name: $first_name, last_name: $last_name, address: $address, email: $email}) {
        uuid
        first_name
        last_name
        email
        __typename
      }
    }`,
  tables: ['bank'],
  type: MutationTypes.CREATE,
  cacheLocation: 'createBank'
}
