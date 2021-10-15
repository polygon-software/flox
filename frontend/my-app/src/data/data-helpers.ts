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
    const { result } = useQuery(query);
    return result;
}

/**
 * Executes a given GraphQL Mutation object, considering cache effects
 * @param {MutationObject} mutationObject
 * @param {Object} variables
 */
async function executeMutation(mutationObject: MutationObject, variables: Object){
    const mutation =  mutationObject.mutation;
    const tables =  mutationObject.tables;
    const type =  mutationObject.type;

    console.log("Execute:", mutation, tables, type);

    const affectedQueries:QueryObject[] = [];

    // Find affected queries based on tables for CREATE and DELETE operations
    if(type === MutationTypes.CREATE || type === MutationTypes.DELETE){
        console.log("Checking for affected queries")
        QUERIES.forEach((query) => {
            console.log("Checking for query!")
            // If any of the mutation's affected tables are relevant to query, add to list of affected queries
            if(tables.some(t => query.tables.indexOf(t) >= 0)){
                affectedQueries.push(query)
                console.log("Is affected!")
            }
        })
    }

    console.log("Affected queries:", affectedQueries)

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

                console.log("old data:", oldData)

                // Case 1: CREATE (adds new object to cache)
                if(type === MutationTypes.CREATE){
                    newData = [...oldData, change]
                }
                // Case 2: DELETE (removes object from cache)
                else if(type === MutationTypes.DELETE){
                    newData = oldData.filter((dataPoint: any) => dataPoint.id !== change.id)
                }

                console.log("new data:", newData)

                cache.writeQuery({ query: queryObject.query, data: {
                        ...data,
                        [cacheLocation]: newData
                    }
                })
            })

        },
    }))

    await mutate(variables);
}


export {executeQuery, executeMutation}
