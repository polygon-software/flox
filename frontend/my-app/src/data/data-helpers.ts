import {useMutation, useQuery} from "@vue/apollo-composable";
import {QUERIES} from "@/data/QUERIES";
import {MutationObject, MutationTypes, QueryObject} from "@/data/DATA-DEFINITIONS";

/**
 * This file contains a collection of helper functions for querying and mutating data using GraphQL/Apollo.
 */

/**
 * Executes a given GraphQL Query object
 * @param {QueryObject} queryObject: A query object, containing the 'query' itself and a list of affected tables
 */
function executeQuery(queryObject: QueryObject){
    const query =  queryObject.query;

    // Execute query
    useQuery(query);
}

/**
 * Executes a given GraphQL Mutation object, considering cache effects
 * @param {MutationObject} mutationObject
 * @param {Object} variables
 */
function executeMutation(mutationObject: MutationObject, variables: Object){
    const mutation =  mutationObject.mutation;
    const tables =  mutationObject.tables;
    const type =  mutationObject.type;

    console.log("Execute:", mutation, tables, type);

    const affectedQueries:QueryObject[] = [];

    // Find affected queries based on tables for CREATE and DELETE operations
    if(type === MutationTypes.CREATE || type === MutationTypes.DELETE){
        console.log("Checking for affected!")
        QUERIES.forEach((query) => {
            // If any of the mutation's affected tables are relevant to query, add to list of affected queries
            if(tables.some(t => query.tables.indexOf(t) >= 0)){
                affectedQueries.push(query)
            }
        })
    }

    console.log("Affected queries:", affectedQueries)

    // Actually execute mutation and handle cache
    useMutation(mutation, () => ({
        // Apply variables
        variables: variables,
        // Get cache and the new or deleted object
        update: (cache, { data: { change } }) => {
            affectedQueries.forEach((queryObject) => {
                // Read existing query from cache
                const data:any = cache.readQuery({ query: queryObject.query })

                // Determine cache location
                const cacheLocation = queryObject.cacheLocation
                let newData

                // Case 1: CREATE (adds new object to cache)
                if(type === MutationTypes.CREATE){
                    newData = [...data[cacheLocation], change]
                }
                // Case 2: DELETE (removes object from cache)
                else if(type === MutationTypes.DELETE){
                    newData = data[cacheLocation].filter((dataPoint: any) => dataPoint.id !== change.id)
                }

                cache.writeQuery({ query: queryObject.query, data: {
                        ...data,
                        [cacheLocation]: newData
                    }
                })
            })

        },
    }))
}


export {executeQuery, executeMutation}
