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
    query myDevices($unassigned: Boolean, $assigned: Boolean){
      myDevices(unassigned: $unassigned, assigned: $assigned){
      ...on MR2000{
        cli
        name
        serialNumber
        numberOfFiles
        pid
        ftp
        ip
        firmware
        project {
          uuid
          name
          __typename
        }
      }
      ...on MR3000{
        cli
        name
        serialNumber
        ftp
        ip
        firmware
        project {
          uuid
          name
          __typename
        }
      }
      __typename
    }}
  `,
  tables: ['device'],
  cacheLocation: 'myDevices',
};

export const LEVEL_WRITING = {
  query: gql`
    query getDeviceData($stationIds: [String!]!, $start: DateTime!, $end: DateTime!, $resolution: Int!){
      levelWriting(stationIds: $stationIds, start: $start, end: $end, resolution: $resolution){
        x{
          name
          data {
            x
            y
          }
        }
        y{
          name
          data {
            x
            y
          }
        }
        z{
          name
          data {
            x
            y
          }
        }
        max
      }
    }
  `,
  tables: ['device'],
  cacheLocation: 'getDeviceData',
};

export const PROJECT_DEVICES = {
  query: gql`
    query getProjectDevices($uuid: ID, $name: String){
      getProjectDevices(uuid: $uuid, name: $name){
        ...on MR2000{
          cli
          name
          serialNumber
          numberOfFiles
          pid
          ftp
          ip
          firmware
          project {
            uuid
            name
            __typename
          }
        }
        ...on MR3000{
          cli
          name
          serialNumber
          ftp
          ip
          firmware
          project {
            uuid
            name
            __typename
          }
        }
        __typename
      }}
  `,
  tables: ['device'],
  cacheLocation: 'getProjectDevices',
};

export const DEVICE_QUERIES: QueryObject[] = [
  USER_DEVICES,
  MY_DEVICES,
  PROJECT_DEVICES,
  LEVEL_WRITING,
];
