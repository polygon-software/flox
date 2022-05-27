/**
 * This file contains all data-relevant definitions (GraphQL/Apollo)
 */

// Types of mutations
import {DocumentNode} from 'graphql';

export enum MutationTypes {
    CREATE,
    UPDATE,
    DELETE
}

// Interface definitions as used in constant files (e.g. QUERIES.ts, USER.ts)
export interface QueryObject {
    query: DocumentNode,             // Actual GraphQL query
    tables: string[],       // Affected Tables
    cacheLocation: string,  // Location in cache (actual GraphQL query name)
}

export interface MutationObject {
    mutation: DocumentNode,          // Actual GraphQL mutation
    tables: string[],       // Affected Tables
    cacheLocation: string,  // Location in cache (actual GraphQL query name)
    type: MutationTypes     // Type of mutation
}
