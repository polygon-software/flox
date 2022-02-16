import gql from 'graphql-tag';
import {MutationTypes} from 'src/data/DATA-DEFINITIONS';

export const CREATE_BANK = {
  mutation: gql`
    mutation createBank($first_name: String!, $last_name: String!, $address: CreateAddressInput!, $email: String!, $abbreviation: String!, $phone: String!, $name: String!, $password: String!){
      createBank (createBankInput: {first_name: $first_name, last_name: $last_name, address: $address, email: $email, abbreviation: $abbreviation, phone: $phone, name: $name, password: $password}) {
        uuid
        first_name
        last_name
        email
        name
        abbreviation
        readable_id
        created_at
        phone
        banned_at
        __typename
      }
    }`,
  tables: ['bank'],
  type: MutationTypes.CREATE,
  cacheLocation: 'createBank'
}
