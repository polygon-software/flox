import { gql } from '@apollo/client/core';

import { MutationObject, MutationTypes } from 'src/apollo/mutation';
import { TABLES } from 'src/data/TABLES';

/**
 * Form-related mutations
 */
export const CREATE_FORM: MutationObject = {
  mutation: gql`
    mutation createForm(
      $job: UpdateJobInput
      $startDate: DateTime
      $endDate: DateTime
      $internalOrderNumber: String
      $externalOrderNumber: String
      $client: UpdateClientInput
      $owner: String
      $objectNumber: String
      $tenant: UpdateTenantInput
      $measurePower: Boolean
      $billing: UpdateBillingInput
      $description: String
      $devices: [UpdateDeviceInput!]
      $protocolDate: DateTime
      $protocolText: String
      $articles: [UpdateArticleInput!]
      $expenses: [UpdateExpenseInput!]
      $totalAmount: Float
      $employeeId: String
      $freeText: String
      $isEmergency: Boolean
      $images: [UpdateImageFileInput!]
    ) {
      createForm(
        createFormInput: {
          job: $job
          startDate: $startDate
          endDate: $endDate
          internalOrderNumber: $internalOrderNumber
          externalOrderNumber: $externalOrderNumber
          client: $client
          owner: $owner
          objectNumber: $objectNumber
          tenant: $tenant
          measurePower: $measurePower
          billing: $billing
          description: $description
          devices: $devices
          protocolDate: $protocolDate
          protocolText: $protocolText
          articles: $articles
          expenses: $expenses
          totalAmount: $totalAmount
          employeeId: $employeeId
          freeText: $freeText
          isEmergency: $isEmergency
          images: $images
        }
      ) {
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
        isEmergency
        isFinished
        __typename
      }
    }
  `,
  tables: [
    TABLES.ADDRESS,
    TABLES.ARTICLE,
    TABLES.BILLING,
    TABLES.CLIENT,
    TABLES.DEVICE,
    TABLES.EXPENSE,
    TABLES.FORM,
    TABLES.IMAGE_FILE,
    TABLES.JOB,
    TABLES.TENANT,
  ],
  type: MutationTypes.CREATE,
  cacheLocation: 'createForm',
};

export const UPDATE_FORM: MutationObject = {
  mutation: gql`
    mutation updateForm(
      $uuid: ID!
      $job: UpdateJobInput
      $startDate: DateTime
      $endDate: DateTime
      $internalOrderNumber: String
      $externalOrderNumber: String
      $client: UpdateClientInput
      $owner: String
      $objectNumber: String
      $tenant: UpdateTenantInput
      $measurePower: Boolean
      $billing: UpdateBillingInput
      $description: String
      $devices: [UpdateDeviceInput!]
      $protocolDate: DateTime
      $protocolText: String
      $articles: [UpdateArticleInput!]
      $expenses: [UpdateExpenseInput!]
      $totalAmount: Float
      $employeeId: String
      $freeText: String
      $isPullable: Boolean
      $isEmergency: Boolean
      $isFinished: Boolean
      $images: [UpdateImageFileInput!]
    ) {
      updateForm(
        updateFormInput: {
          uuid: $uuid
          job: $job
          startDate: $startDate
          endDate: $endDate
          internalOrderNumber: $internalOrderNumber
          externalOrderNumber: $externalOrderNumber
          client: $client
          owner: $owner
          objectNumber: $objectNumber
          tenant: $tenant
          measurePower: $measurePower
          billing: $billing
          description: $description
          devices: $devices
          protocolDate: $protocolDate
          protocolText: $protocolText
          articles: $articles
          expenses: $expenses
          totalAmount: $totalAmount
          employeeId: $employeeId
          freeText: $freeText
          isPullable: $isPullable
          isEmergency: $isEmergency
          isFinished: $isFinished
          images: $images
        }
      ) {
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
        isEmergency
        isFinished
        __typename
      }
    }
  `,
  tables: [
    TABLES.ADDRESS,
    TABLES.ARTICLE,
    TABLES.BILLING,
    TABLES.CLIENT,
    TABLES.DEVICE,
    TABLES.EXPENSE,
    TABLES.FORM,
    TABLES.IMAGE_FILE,
    TABLES.JOB,
    TABLES.TENANT,
  ],
  type: MutationTypes.DEVALIDATINGUPDATE,
  cacheLocation: 'updateForm',
};

export const DELETE_FORM: MutationObject = {
  mutation: gql`
    mutation deleteForm($uuid: ID!, $softDelete: Boolean) {
      deleteForm(deleteInput: { uuid: $uuid, softDelete: $softDelete }) {
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
        isEmergency
        isFinished
        __typename
      }
    }
  `,
  tables: [
    TABLES.ADDRESS,
    TABLES.ARTICLE,
    TABLES.BILLING,
    TABLES.CLIENT,
    TABLES.DEVICE,
    TABLES.EXPENSE,
    TABLES.FORM,
    TABLES.IMAGE_FILE,
    TABLES.JOB,
    TABLES.TENANT,
  ],
  type: MutationTypes.DELETE,
  cacheLocation: 'deleteForm',
};
