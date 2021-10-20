/**
 * This file contains all data-relevant definitions (GraphQL/Apollo)
 */

// Types of mutations
export enum MutationTypes {
    CREATE,
    UPDATE,
    DELETE
}

// Interface definitions as used in constant files (e.g. QUERIES.ts, MUTATIONS.ts)
export interface QueryObject {
    query: any,             // Actual GraphQL query
    tables: string[],       // Affected Tables
    cacheLocation: string,  // Location in cache (actual GraphQL query name)
}

export interface MutationObject {
    mutation: any,          // Actual GraphQL mutation
    tables: string[],       // Affected Tables
    cacheLocation: string,  // Location in cache (actual GraphQL query name)
    type: MutationTypes     // Type of mutation
}
