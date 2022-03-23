import gql from 'graphql-tag';
import { QueryObject } from 'src/data/DATA-DEFINITIONS';

/**
 * Device-related queries
 */

export const USER_DEVICES = {
  query: gql`
    query getUserDevices($uuid: ID!) {
      getUserDevices(uuid: $uuid) {
        cli
        __typename
      }
    }
  `,
  tables: ['user'],
  cacheLocation: 'getUserDevices',
};

export const MY_DEVICES = {
  query: gql`
    query myDevices($unassigned: Boolean, $assigned: Boolean) {
      myDevices(unassigned: $unassigned, assigned: $assigned) {
        cli
        name
        serialNumber
        pid
        ftp
        ip
        firmware
        project {
          uuid
          name
          __typename
        }
        __typename
      }
    }
  `,
  tables: ['device'],
  cacheLocation: 'myDevices',
};

export const LEVEL_WRITING = {
  query: gql`
    query getLevelWriting(
      $clients: [String!]!
      $start: DateTime!
      $end: DateTime!
      $resolution: Int!
    ) {
      levelWriting(
        clients: $clients
        start: $start
        end: $end
        resolution: $resolution
      ) {
        x {
          name
          data {
            x
            y
          }
        }
        y {
          name
          data {
            x
            y
          }
        }
        z {
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
    query getDeviceParams($cli: String!) {
      deviceParams(cli: $cli) {
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
  cacheLocation: 'deviceParams',
};

export const PROJECT_DEVICES = {
  query: gql`
    query getProjectDevices($uuid: ID, $name: String) {
      getProjectDevices(uuid: $uuid, name: $name) {
        cli
        name
        serialNumber
        pid
        ftp
        ip
        firmware
        project {
          uuid
          name
          __typename
        }
        __typename
      }
    }
  `,
  tables: ['device'],
  cacheLocation: 'getProjectDevices',
};

export const EVENT_TABLE_ROWS = {
  query: gql`
    query eventTable(
      $stationId: String!
      $skip: Int!
      $take: Int!
      $filter: String
      $orderBy: String
      $descending: Boolean
    ) {
      eventTable(
        cli: $stationId
        skip: $skip
        take: $take
        filter: $filter
        orderBy: $orderBy
        descending: $descending
      ) {
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
  cacheLocation: 'eventTable',
};

export const DEVICE_CONTACTS = {
  query: gql`
    query getDeviceContacts($cli: String!) {
      getDeviceContacts(cli: $cli) {
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
  cacheLocation: 'getDeviceContacts',
};

export const DEVICE_QUERIES: QueryObject[] = [
  USER_DEVICES,
  MY_DEVICES,
  PROJECT_DEVICES,
  LEVEL_WRITING,
  DEVICE_PARAMS,
  EVENT_TABLE_ROWS,
  DEVICE_CONTACTS,
];
