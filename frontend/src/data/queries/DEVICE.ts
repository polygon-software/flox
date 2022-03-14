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
  tables: ['user'],
  cacheLocation: 'getDeviceData',
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

export const EVENT_TABLE_ROWS = {
  query: gql`
    query eventTable(
      $stationId: String!,
      $skip: Int!,
      $take: Int!,
      $filter: String,
      $orderBy: String,
      $descending: Boolean
    ){
      eventTable(cli: $stationId, skip: $skip, take: $take, filter: $filter, orderBy: $orderBy, descending: $descending){
        items {
          file
          type
          dateTime
          peakX
          peakY
          peakZ
          downloadURL
          fileName
          previewURL
          frequencyX
          frequencyY
          frequencyZ
          VSUM
          __typename
        }
        lengthAll
        lengthEvt
        lengthPk
        lengthZip
        __typename
      }
    }
  `,
  tables: [],
  cacheLocation: 'eventTable'
}

export const DEVICE_QUERIES: QueryObject[] = [
  USER_DEVICES,
  MY_DEVICES,
  PROJECT_DEVICES,
  LEVEL_WRITING,
  EVENT_TABLE_ROWS
];
