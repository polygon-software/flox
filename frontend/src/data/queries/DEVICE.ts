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

export const LEVEL_WRITING = {
  query: gql`
    query getLevelWriting($stationIds: [String!]!, $start: DateTime!, $end: DateTime!, $resolution: Int!){
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
  cacheLocation: 'getLevelWriting',
};

export const DEVICE_PARAMS = {
  query: gql`
    query getDeviceParams($stationId: String!){
      deviceParams(stationId: $stationId){
        trigX
        trigY
        trigZ
        ala1X
        ala1Y
        ala1Z
        ala2X
        ala2Y
        ala2Z
        unitX
        unitY
        unitZ
      }
    }
  `,
  tables: ['device'],
  cacheLocation: 'getDeviceParams',
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
  tables: ['device'],
  cacheLocation: 'getProjectDevices',
};

export const DEVICE_QUERIES: QueryObject[] = [
  USER_DEVICES,
  MY_DEVICES,
  PROJECT_DEVICES,
  LEVEL_WRITING,
  DEVICE_PARAMS,
];
