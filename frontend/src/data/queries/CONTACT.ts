import gql from 'graphql-tag';
import { QueryObject } from 'src/data/DATA-DEFINITIONS';

/**
 * Contact-related queries
 */

export const DEVICE_CONTACTS = {
  query: gql`
    query getDeviceContacts(
      $cli: String!,
    ){
      getDeviceContacts(cli: $cli){
        id
        cli
        name
        email
        phone
        event
        alarm1
        alarm2
        smsLimit
        power
        memory
        daily
        __typename
      }
    }
  `,
  tables: ['contact'],
  cacheLocation: 'getDeviceContacts'
}

export const MY_CONTACTS = {
  query: gql`
    query myContacts{
      myContacts{
        id
        cli
        name
        email
        phone
        event
        alarm1
        alarm2
        smsLimit
        power
        memory
        daily
        __typename
      }
    }
  `,
  tables: ['contact'],
  cacheLocation: 'myContacts'
}



export const CONTACT_QUERIES: QueryObject[] = [
  DEVICE_CONTACTS
];
