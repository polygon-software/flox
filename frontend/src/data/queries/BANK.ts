import gql from 'graphql-tag';

export const BANK = {
  query: gql`
    query getBank($uuid: ID!){
      getBank(uuid: $uuid){
        uuid
        __typename
        name
        abbreviation
        first_name
        last_name
        email
        readable_id
        created_at
        phone
      }
    }
  `,
  tables: ['bank'],
  cacheLocation: 'getBanks'
}

export const ALL_BANKS = {
  query: gql`
    query getBanks{
      getBanks{
        uuid
        __typename
        name
        abbreviation
        first_name
        last_name
        email
        readable_id
        created_at
        phone
      }
    }
  `,
  tables: ['bank'],
  cacheLocation: 'getBanks'
}

export const ALL_BANK_NAMES = {
  query: gql`
    query getBankList{
      getBankList {
        uuid
        name
        abbreviation
        __typename
      }
    }
  `,
  tables: ['bank'],
  cacheLocation: 'getBankNames'
}

export const MY_BANK = {
  query: gql`
    query getMyBank($bankUuid: String){
      getMyBank(bankUuid: $bankUuid){
        uuid
        first_name
        last_name
        readable_id
        email
        __typename
      }
    }
  `,
  tables: ['bank', 'offer'],
  cacheLocation: 'getMyBank'
}

export const BANK_NAME_SUGGESTIONS = {
  query: gql`
    query getBankNameSuggestions{
      getBankNameSuggestions {
        uuid
        name
        abbreviation
        __typename
      }
    }
  `,
  tables: ['bank'],
  cacheLocation: 'getBankNameSuggestions'
}

const BANK_QUERIES = [
  BANK,
  ALL_BANK_NAMES,
  ALL_BANKS,
  MY_BANK,
  BANK_NAME_SUGGESTIONS
]


export default BANK_QUERIES
