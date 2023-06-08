import { gql } from '@apollo/client/core';

import { QueryObject } from 'src/apollo/query';
import { TABLES } from 'src/data/TABLES';

/**
 * Form-related queries
 */

export const SEARCH_FORMS: QueryObject = {
  query: gql`
    query searchForms(
      $take: Int
      $skip: Int
      $filter: FormFilterInput
      $searchTerm: String
      $sortBy: String
      $descending: Boolean
    ) {
      searchForms(
        take: $take
        skip: $skip
        filter: $filter
        searchTerm: $searchTerm
        sortBy: $sortBy
        descending: $descending
      ) {
        count
        data {
          createdAt
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
            uuid
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
          protocolDate
          protocolText
          totalAmount
          employeeId
          freeText
          isPullable
          pulledAt
          isEmergency
          isFinished
          __typename
        }
      }
    }
  `,
  tables: [TABLES.FORM],
  cacheLocation: 'searchForms',
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
          uuid
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
        pulledAt
        isEmergency
        isFinished
        __typename
      }
    }
  `,
  tables: [TABLES.FORM],
  cacheLocation: 'getForm',
};

export const FORM_QUERIES: QueryObject[] = [SEARCH_FORMS, FORM];
