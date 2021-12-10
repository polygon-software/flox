import gql from 'graphql-tag';
import {MutationTypes} from 'src/data/DATA-DEFINITIONS';

export const CREATE_BANK = {
  mutation: gql`
    mutation createBank($first_name: String!, $last_name: String!, $address: CreateAddressInput!, $email: String!, $offer: CreateOfferInput!){
      createBank (createBankInput: {first_name: $first_name, last_name: $last_name, address: $address, email: $email, offer: $offer}) {
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

export const ASSOCIATE_USER_TO_BANK ={
  mutation: gql`
    mutation associateUserToCompany($uuid: ID!){
      associateUserToCompany(associateUserInput: {uuid: $uuid}) {
        uuid
        __typename
      }
    }
  `,
  tables: ['bank'],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined
}
