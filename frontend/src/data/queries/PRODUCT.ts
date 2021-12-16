import gql from 'graphql-tag';
import {QueryObject} from 'src/data/DATA-DEFINITIONS';

/**
 * Product-related queries
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

export const PRODUCT_QUERIES: QueryObject[] = [ALL_PRODUCTS, MY_PRODUCTS, PRODUCT]
