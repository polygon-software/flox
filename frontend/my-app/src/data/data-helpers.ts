import {useApolloClient, useMutation, useQuery} from '@vue/apollo-composable';
import {QUERIES} from './QUERIES';
import {MutationObject, MutationTypes, QueryObject} from './DATA-DEFINITIONS';
import {ApolloQueryResult} from "@apollo/client";
import {computed, onMounted, onServerPrefetch, ref} from "vue";
import {useStore} from "src/store";

/**
 * This file contains a collection of helper functions for querying and mutating data using GraphQL/Apollo.
 */

/**
 * Executes a given GraphQL query object
 * @param {QueryObject} queryObject - the query object constant (from QUERIES.ts)
 */
async function executeQuery(queryObject: QueryObject): Promise<ApolloQueryResult<any>> {
  const queryResult = useQuery(queryObject.query)
  return new Promise(((resolve, reject) => {
    queryResult.onResult((res)=>{resolve(res)})
    queryResult.onError((err)=>{reject(err)})
  }))
}

/**
 * Executes a given GraphQL mutation object, automatically handling cache by re-fetching affected queries
 * @param {MutationObject} mutationObject - the mutation object constant (from MUTATIONS.ts)
 * @param {Object} variables - any variables that shall be passed to the mutation
 */
async function executeMutation(mutationObject: MutationObject, variables: Record<string, unknown>): Promise<void> {
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
                const data:Record<string, Array<unknown>>|null = cache.readQuery({ query: queryObject.query })

                if(data) {
                  // Determine cache location
                  const cacheLocation = queryObject.cacheLocation
                  const oldData:Array<unknown> = data[cacheLocation]
                  let newData

                  // Case 1: CREATE (adds new object to cache)
                  if (type === MutationTypes.CREATE) {
                    newData = [...oldData, change]
                  }
                  // Case 2: DELETE (removes object from cache)
                  else if (type === MutationTypes.DELETE) {
                    newData = oldData.filter((dataPoint: any) => dataPoint.id !== change.id)
                  }

                  // Update data in cache
                  cache.writeQuery({
                    query: queryObject.query, data: {
                      ...data,
                      [cacheLocation]: newData
                    }
                  })
                }
            })

        },
    }))
    // Execute mutation
    await mutate(variables);
}

function subscribeToQuery(query: QueryObject){
  const store = useStore();
  const res = ref(undefined)

  const display_res = computed(()=>{
    if(res.value){
      return res.value
    }
    const store_state = store.getters['ssr/getPrefetchedData'](query.cacheLocation) as Record<string, unknown[]>
    if(store_state){
      return store_state;
    }
    return undefined
  })

  // ----- Hooks -----
  onServerPrefetch(async () => {
    const temp_res = await executeQuery(query)
    res.value = temp_res.data;
    store.commit("ssr/setPrefetchedData", {key: query.cacheLocation, value: res})
  })

  onMounted( () => {
    const polo = useApolloClient().resolveClient()

    const store_state = store.getters['ssr/getPrefetchedData'](query.cacheLocation)[query.cacheLocation] as Record<string, unknown>[]



    polo.writeQuery({
      query: query.query,
      data: {
        [query.cacheLocation]: store_state
      }
    })
    polo.watchQuery({query: query.query}).subscribe({
      next(value: ApolloQueryResult<any>) {
        res.value = value.data
      }
    })
  })
  return display_res;
}


export {executeQuery, executeMutation, subscribeToQuery}
