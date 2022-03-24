import gql from 'graphql-tag';
import { MutationTypes } from '../DATA-DEFINITIONS';

/**
 * This file contains all valid GraphQL mutations for projects. A mutation is structure as follows
 * (see also DATA-DEFINITIONS.ts):
 * - mutation: the actual GraphQL mutation. Add __typename to the variables if the mutation UPDATES or CREATES data.
 * - tables: list of affected tables; when the mutation is executed, the corresponding queries are re-fetched.
 * - type: the mutation's type (either CREATE, DELETE or UPDATE); this determines cache handling
 * - cacheLocation: the actual GraphQL mutation's name (since cached data will be stored there)
 */

export const CREATE_PROJECT = {
  mutation: gql`
    mutation createProject($userUuid: ID!, $name: String!) {
      createProject(createProjectInput: { userUuid: $userUuid, name: $name }) {
        uuid
        name
        devices
        __typename
      }
    }
  `,
  tables: ['project'],
  type: MutationTypes.CREATE,
  cacheLocation: 'createProject',
};

export const DELETE_PROJECT = {
  mutation: gql`
    mutation deleteProject($uuid: ID!) {
      deleteProject(deleteProjectInput: { uuid: $uuid }) {
        uuid
        name
        devices
        __typename
      }
    }
  `,
  tables: ['project'],
  type: MutationTypes.DELETE,
  cacheLocation: 'deleteProject',
};

export const REMOVE_DEVICE_FROM_PROJECT = {
  mutation: gql`
    mutation removeDeviceFromProject($name: String!, $cli: String!) {
      removeDeviceFromProject(
        removeDeviceFromProjectInput: { name: $name, cli: $cli }
      ) {
        uuid
        name
        devices
        __typename
      }
    }
  `,
  tables: ['project', 'device'],
  type: MutationTypes.DEVALIDATINGUPDATE,
  cacheLocation: undefined,
};

export const ASSIGN_DEVICE_TO_PROJECT = {
  mutation: gql`
    mutation assignDeviceToProject($uuid: ID!, $cli: String!) {
      assignDeviceToProject(
        assignDeviceToProjectInput: { uuid: $uuid, cli: $cli }
      ) {
        uuid
        name
        devices
        __typename
      }
    }
  `,
  tables: ['project', 'device'],
  type: MutationTypes.DEVALIDATINGUPDATE,
  cacheLocation: undefined,
};

export const UPDATE_PROJECT_NAME = {
  mutation: gql`
    mutation updateProjectName($uuid: ID!, $name: String!) {
      updateProjectName(updateProjectInput: { uuid: $uuid, name: $name }) {
        uuid
        name
        devices
        user {
          uuid
        }
        __typename
      }
    }
  `,
  tables: ['project'],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined,
};
