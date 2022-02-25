import gql from 'graphql-tag';
import { QueryObject } from 'src/data/DATA-DEFINITIONS';

/**
 * Device-related queries
 */

export const USER_DEVICES = {
  query: gql`
    query getUserDevices($uuid: ID!){
      getUserDevices(uuid: $uuid){
      ...on MR2000{
        cli
      }
      ...on MR3000{
        cli
      }
      __typename
    }}
  `,
  tables: ['user'],
  cacheLocation: 'getUserDevices',
};

export const MY_DEVICES = {
  query: gql`
    query{
      myDevices{
      ...on MR2000{
        cli
      }
      ...on MR3000{
        cli
      }
      __typename
    }}
  `,
  tables: ['user'],
  cacheLocation: 'getUserDevices',
};

export const PROJECT_DEVICES = {
  query: gql`
    query getProjectDevices($name: String!){
      getProjectDevices(name: $name){
        ...on MR2000{
          cli
        }
        ...on MR3000{
          cli
        }
        __typename
      }}
  `,
  tables: ['user'],
  cacheLocation: 'getProjectDevices',
};

export const DEVICE_QUERIES: QueryObject[] = [

  USER_DEVICES,
  MY_DEVICES,
  PROJECT_DEVICES
];
