import gql from 'graphql-tag';
import { QueryObject } from 'src/data/DATA-DEFINITIONS';

/**
 * Project-related queries
 */

export const USER_PROJECTS = {
  query: gql`
    query getUserProjects($uuid: ID!){
      getUserProjects(uuid: $uuid){
        name
        mr2000instances{
          cli
        }
        mr3000instances{
          cli
        }
      __typename
    }}
  `,
  tables: ['project'],
  cacheLocation: 'getUserProjects',
};

export const MY_PROJECTS = {
  query: gql`
    query{
      myProjects{
        name
        mr2000instances{
          cli
        }
        mr3000instances{
          cli
        }
        __typename
      }}
  `,
  tables: ['project'],
  cacheLocation: 'myProjects',
};

export const PROJECT_QUERIES: QueryObject[] = [
  USER_PROJECTS,
  MY_PROJECTS,
];
