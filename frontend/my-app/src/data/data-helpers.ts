import {useQuery} from "@vue/apollo-composable";
import {ALL_USERS} from "@/data/QUERIES";
import {DocumentParameter} from "@vue/apollo-composable/dist/useQuery";

/**
 * This file contains a collection of helper functions for querying and mutating data using GraphQL/Apollo.
 */

// Interface definition as used in constant files (e.g. QUERIES.ts, MUTATIONS.ts)
interface QueryObject {
    query: DocumentParameter<any>, // Actual GraphQL query
    tables: string[],              // Affected Tables
}

/***
 *
 * @param {QueryObject} queryObject: A query object, containing the 'query' itself and a list of affected tables
 */
function executeQuery(queryObject: QueryObject){
    const query =  queryObject.query;
    const tables =  queryObject.tables;

    // Execute query itself
    useQuery(query)
}

function executeMutation(){

}


export {executeQuery}
