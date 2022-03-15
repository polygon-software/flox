import gql from 'graphql-tag';
import {MutationTypes} from '../DATA-DEFINITIONS';

/**
 * This file contains all valid GraphQL mutations for devices. A mutation is structure as follows
 * (see also DATA-DEFINITIONS.ts):
 * - mutation: the actual GraphQL mutation. Add __typename to the variables if the mutation UPDATES or CREATES data.
 * - tables: list of affected tables; when the mutation is executed, the corresponding queries are re-fetched.
 * - type: the mutation's type (either CREATE, DELETE or UPDATE); this determines cache handling
 * - cacheLocation: the actual GraphQL mutation's name (since cached data will be stored there)
 */

export const ADD_CONTACT_TO_DEVICE = {
  mutation: gql`
    mutation addContactToDevice($cli: String!, $name: String!, $phone: String!, $email: String!, $event: Boolean!, $alarm1: Boolean!,  $alarm2: Boolean!, $smsLimit: Boolean!, $power: Boolean!, $memory: Boolean!, $daily: Boolean!){
      addContactToDevice (addContactToDeviceInput: {cli: $cli, name: $name, email: $email, phone: $phone, event: $event, alarm1: $alarm1, alarm2: $alarm2, smsLimit: $smsLimit, power: $power, memory: $memory, daily: $daily} ) {
        ...on MR2000 {
          name
        }
        ...on MR3000 {
          name
        }
        __typename
      }
    }`,
  tables: ['contact'],
  type: MutationTypes.DEVALIDATINGUPDATE,
  cacheLocation: undefined
}

export const EDIT_CONTACT = {
  mutation: gql`
    mutation editContact($id: Int!, $cli: String!, $name: String!, $phone: String!, $email: String!, $event: Boolean!, $alarm1: Boolean!,  $alarm2: Boolean!, $smsLimit: Boolean!, $power: Boolean!, $memory: Boolean!, $daily: Boolean!){
      editContact (editContactInput: {id: $id, cli: $cli, name: $name, email: $email, phone: $phone, event: $event, alarm1: $alarm1, alarm2: $alarm2, smsLimit: $smsLimit, power: $power, memory: $memory, daily: $daily} ) {
        ...on MR2000 {
          name
        }
        ...on MR3000 {
          name
        }
        __typename
      }
    }`,
  tables: ['contact'],
  type: MutationTypes.DEVALIDATINGUPDATE,
  cacheLocation: undefined
}
