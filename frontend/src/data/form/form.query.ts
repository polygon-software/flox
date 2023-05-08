import { gql } from '@apollo/client/core';

import { QueryObject } from 'src/apollo/query';
import { TABLES } from 'src/data/TABLES';

/**
 * Form-related queries
 */
export const ALL_FORMS: QueryObject = {
  query: gql`
    query {
      getAllForms {
        uuid
        job {
          uuid
          type
          status
          __typename
        }
        startDate
        endDate
        internalOrderNumber
        externalOrderNumber
        client {
          uuid
          firstName
          lastName
          companyName
          companyLegalForm
          address {
            uuid
            street
            number
            city
            zipCode
            additionalAddress
            __typename
          }
          phoneNumber
          email
          __typename
        }
        owner
        objectNumber
        tenant {
          firstName
          lastName
          address {
            uuid
            street
            number
            city
            zipCode
            additionalAddress
            __typename
          }
          phoneNumber
          email
          floorType
          floorNumber
          __typename
        }
        measurePower
        billing {
          uuid
          companyName
          firstName
          lastName
          address {
            uuid
            street
            number
            city
            zipCode
            additionalAddress
            __typename
          }
          email
          __typename
        }
        description
        devices {
          uuid
          deviceType
          deviceManufacturer
          deviceModel
          deviceProductionNumber
          deviceProductionYear
          deviceInformation
          __typename
        }
        protocolDate
        protocolText
        articles {
          uuid
          articleNumber
          manufacturerNumber
          amount
          discount
          __typename
        }
        expenses {
          uuid
          name
          timeAmount
          discount
          __typename
        }
        totalAmount
        employeeId
        freeText
        images {
          uuid
          __typename
        }
        isPullable
        isEmergency
        isFinished
        __typename
      }
    }
  `,
  tables: [TABLES.FORM],
  cacheLocation: 'allForms',
};

export const FORM: QueryObject = {
  query: gql`
    query getForm($uuid: ID!) {
      getForm(uuid: $uuid) {
        uuid
        job {
          uuid
          type
          status
          __typename
        }
        startDate
        endDate
        internalOrderNumber
        externalOrderNumber
        client {
          uuid
          firstName
          lastName
          companyName
          companyLegalForm
          address {
            uuid
            street
            number
            city
            zipCode
            additionalAddress
            __typename
          }
          phoneNumber
          email
          __typename
        }
        owner
        objectNumber
        tenant {
          firstName
          lastName
          address {
            uuid
            street
            number
            city
            zipCode
            additionalAddress
            __typename
          }
          phoneNumber
          email
          floorType
          floorNumber
          __typename
        }
        measurePower
        billing {
          uuid
          companyName
          firstName
          lastName
          address {
            uuid
            street
            number
            city
            zipCode
            additionalAddress
            __typename
          }
          email
          __typename
        }
        description
        devices {
          uuid
          deviceType
          deviceManufacturer
          deviceModel
          deviceProductionNumber
          deviceProductionYear
          deviceInformation
          __typename
        }
        protocolDate
        protocolText
        articles {
          uuid
          articleNumber
          manufacturerNumber
          amount
          discount
          __typename
        }
        expenses {
          uuid
          name
          timeAmount
          discount
          __typename
        }
        totalAmount
        employeeId
        freeText
        images {
          uuid
          __typename
        }
        isPullable
        isEmergency
        isFinished
        __typename
      }
    }
  `,
  tables: [TABLES.FORM],
  cacheLocation: 'form',
};
