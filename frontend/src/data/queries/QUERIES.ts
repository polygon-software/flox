import gql from 'graphql-tag';

/**
 * This file contains all valid GraphQL queries. A query is structure as follows
 * (see also DATA-DEFINITIONS.ts):
 * - query: the actual GraphQL query. Add __typename to the variables in order for caching to work as expected
 * (auto-update on edit)
 * - tables: list of affected tables; when a mutation changes one of these tables, the query is re-fetched.
 * - cacheLocation: the actual GraphQL query's name (since cached data will be stored there)
 *
 * When adding a new query, also add it to the QUERIES array at the bottom of this file.
 */

export const ALL_PRODUCTS = {
    query: gql`
        query{
            allProducts{
              uuid
              title
              description
              brand
              value
              currency
              start
              end
              category
              directBuyLink
              brandLink
              minBet
              maxBet
              tags
              status
              pictures{
                uuid
                url
                __typename
              }
              __typename
            }
        }
        `,
    tables: ['product'],
    cacheLocation: 'allProducts'
}

// TODO implement on backend; for now, we use allProducts
export const MY_PRODUCTS = {
    query: gql`
        query{
            allProducts{
              uuid
              title
              description
              brand
              value
              currency
              start
              end
              category
              directBuyLink
              brandLink
              sponsored
              status
              minBet
              tags
              maxBet
              pictures{
                uuid
                url
                __typename
              }
              __typename
            }
        }
        `,
    tables: ['product'],
    cacheLocation: 'allProducts'
}

export const PRODUCT = {
  query: gql`
    query product($uuid: ID!){
      product(uuid: $uuid){
        uuid
        title
        description
        brand
        value
        currency
        start
        end
        category
        sponsored
        directBuyLink
        directBuyLinkMaxClicks
        directBuyLinkMaxCost
        brandLink
        brandLinkMaxClicks
        brandLinkMaxClicks
        minBet
        maxBet
        tags
        status
        pictures{
          uuid
          url
          __typename
        }
        __typename
      }
    }
  `,
  tables: ['product'],
  cacheLocation: 'product'
}


export const QUERIES = [ALL_PRODUCTS, MY_PRODUCTS, PRODUCT];
