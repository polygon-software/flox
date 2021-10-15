import {useMutation, useQuery} from "@vue/apollo-composable";
import {QUERIES} from "@/data/QUERIES";
import {DocumentParameter} from "@vue/apollo-composable/dist/useQuery";
import {QueryObject, MutationObject, MutationTypes} from "@/data/DATA-DEFINITIONS";
import {DELETE_USER} from "@/data/MUTATIONS";

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
 */
function executeMutation(mutationObject: MutationObject){
    const mutation =  mutationObject.mutation;
    const tables =  mutationObject.tables;
    const type =  mutationObject.type;

    // Find affected queries based on tables
    QUERIES.forEach((QUERY) => {

    })

    // Execute mutation and handle cache
    useMutation(mutation, () => ({
        update: (cache, { data: { remove } }) => {
            const data = cache.readQuery({ query: ALL_USERS })
            // Remove on cache
            cache.writeQuery({ query: ALL_USERS, data: {
                    ...data,
                    allUsers: data.allUsers.filter(user => user.id !== remove.id)
                }
            })
        },
    }))
}


export {executeQuery}
