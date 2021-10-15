import {DocumentParameter} from "@vue/apollo-composable/dist/useQuery";

/**
 * TODO docs.
 */


// Types of mutations
export enum MutationTypes {
    CREATE,
    UPDATE,
    DELETE
}

// Interface definitions as used in constant files (e.g. QUERIES.ts, MUTATIONS.ts)
export interface QueryObject {
    query: DocumentParameter<any>, // Actual GraphQL query
    tables: string[],              // Affected Tables
}

export interface MutationObject {
    mutation: DocumentParameter<any>, // Actual GraphQL mutation
    tables: string[],              // Affected Tables
    type: MutationTypes            // Type of mutation
}
