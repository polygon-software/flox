import gql from 'graphql-tag';
import {MutationTypes} from '../DATA-DEFINITIONS';

/**
 * This file contains all valid GraphQL mutations. A mutation is structure as follows
 * (see also DATA-DEFINITIONS.ts):
 * - mutation: the actual GraphQL mutation. Add __typename to the variables if the mutation UPDATES or CREATES data.
 * - tables: list of affected tables; when the mutation is executed, the corresponding queries are re-fetched.
 * - type: the mutation's type (either CREATE, DELETE or UPDATE); this determines cache handling
 * - cacheLocation: the actual GraphQL mutation's name (since cached data will be stored there)
 *
 */

export const CREATE_PRODUCT = {
    mutation: gql`
        mutation createProduct($createProductInput: CreateProductInput!, $pictures: [String!]!){
            createProduct (createProductInput: $createProductInput, pictures: $pictures) {
              uuid
              status
              title
              description
              brand
              value
              currency
              start
              sponsored
              end
              category
              directBuyLink
              directBuyLinkMaxClicks
              directBuyLinkMaxCost
              brandLink
              brandLinkMaxClicks
              brandLinkMaxCost
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
        }`,
    tables: ['product', 'public_file'],
    type: MutationTypes.CREATE,
    cacheLocation: 'createProduct'
}

export const UPDATE_PRODUCT = {
    mutation: gql`
        mutation updateProduct($updateProductInput: UpdateProductInput!, $pictures: [String!]){
            updateProduct(updateProductInput: $updateProductInput, pictures: $pictures) {
              uuid
              status
              sponsored
              title
              description
              brand
              value
              currency
              start
              end
              category
              directBuyLink
              directBuyLinkMaxClicks
              directBuyLinkMaxCost
              brandLink
              brandLinkMaxClicks
              brandLinkMaxCost
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
        }`,
    tables: ['product', 'public_file'],
    type: MutationTypes.UPDATE,
    cacheLocation: undefined
}

export const DUPLICATE_PRODUCT = {
    mutation: gql`
        mutation duplicateProduct($duplicateProductInput: DuplicateProductInput!){
            duplicateProduct(duplicateProductInput: $duplicateProductInput) {
              uuid
              status
              sponsored
              title
              description
              brand
              value
              currency
              start
              end
              category
              directBuyLink
              directBuyLinkMaxClicks
              directBuyLinkMaxCost
              brandLink
              brandLinkMaxClicks
              brandLinkMaxCost
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
        }`,
    tables: ['product'],
    type: MutationTypes.CREATE,
    cacheLocation: 'duplicateProduct'
}