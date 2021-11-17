import gql from 'graphql-tag';
import {MutationTypes} from 'src/data/DATA-DEFINITIONS';


const CREATE_USER = {
  mutation: gql`
    mutation createUser($name: String!, $age: Int!){
      create (createUserInput: {name: $name, age: $age}) {
        uuid
        name
        age
        __typename
      }
    }`,
  tables: ['user'],
  type: MutationTypes.CREATE,
  cacheLocation: 'create'
}

const UPDATE_USER = {
  mutation: gql`
    mutation updateUser($uuid: ID!, $name: String, $age: Int){
      update (updateUserInput: {uuid: $uuid, name: $name, age: $age}) {
        uuid
        name
        age
        __typename
      }
    }`,
  tables: ['user'],
  type: MutationTypes.UPDATE,
  cacheLocation: 'update'
}

const DELETE_USER = {
  mutation: gql`
    mutation deleteUser($uuid: ID!){
      remove (deleteUserInput: {uuid: $uuid}) {
        uuid
      }
    }`,
  tables: ['user'],
  type: MutationTypes.DELETE,
  cacheLocation: 'remove'
}

export const USER_MUTATIONS = [CREATE_USER, UPDATE_USER, DELETE_USER]
