import {useMutation, useQuery} from "@vue/apollo-composable";
import {QUERIES} from "@/data/QUERIES";
import {MutationObject, MutationTypes, QueryObject} from "@/data/DATA-DEFINITIONS";

/**
 * This file contains a collection of helper functions for querying and mutating data using GraphQL/Apollo.
 */

/**
 * Executes a given GraphQL query object
 * @param {QueryObject} queryObject - the query object constant (from QUERIES.ts)
 */
function executeQuery(queryObject: QueryObject){
    const query =  queryObject.query;

    // Execute query
    const { result } = useQuery(query);
    return result;
}

/**
 * Executes a given GraphQL mutation object, automatically handling cache by re-fetching affected queries
 * @param {MutationObject} mutationObject - the mutation object constant (from MUTATIONS.ts)
 * @param {Object} variables - any variables that shall be passed to the mutation
 */
async function executeMutation(mutationObject: MutationObject, variables: Object){
    const mutation =  mutationObject.mutation
    const tables =  mutationObject.tables
    const type =  mutationObject.type

    if([mutation, tables, type, mutationObject.cacheLocation].some(item => item === undefined)){
        throw new Error("One or more of the following properties are missing for the given mutation: 'mutation', 'tables', 'type', 'cacheLocation'")
    }

    const affectedQueries:QueryObject[] = [];

    // Find affected queries based on tables for CREATE and DELETE operations
    if(type === MutationTypes.CREATE || type === MutationTypes.DELETE){
        QUERIES.forEach((query) => {
            // If any of the mutation's affected tables are relevant to query, add to list of affected queries
            if(tables.some(t => query.tables.indexOf(t) >= 0)){
                affectedQueries.push(query)
            }
        })
    }

    // Actually execute mutation and handle cache
    const { mutate } = useMutation(mutation, () => ({
        // Get cache and the new or deleted object
        update: (cache, { data: changeData }) => {
            affectedQueries.forEach((queryObject) => {

                // Get actual changed/added/removed object
                const change = changeData[mutationObject.cacheLocation]

                // Read existing query from cache
                const data:any = cache.readQuery({ query: queryObject.query })

                // Determine cache location
                const cacheLocation = queryObject.cacheLocation
                const oldData = data[cacheLocation]
                let newData

                // Case 1: CREATE (adds new object to cache)
                if(type === MutationTypes.CREATE){
                    newData = [...oldData, change]
                }
                // Case 2: DELETE (removes object from cache)
                else if(type === MutationTypes.DELETE){
                    newData = oldData.filter((dataPoint: any) => dataPoint.id !== change.id)
                }

                // TODO separate create/delete
                cache.writeQuery({ query: queryObject.query, data: {
                        ...data,
                        [cacheLocation]: newData
                    }
                })
            })

        },
    }))

    // Execute mutation
    await mutate(variables);
}

export {executeQuery, executeMutation}
