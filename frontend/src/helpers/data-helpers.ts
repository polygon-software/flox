import {useApolloClient, useMutation, useQuery} from '@vue/apollo-composable';
import {MutationObject, MutationTypes, QueryObject} from '../data/DATA-DEFINITIONS';
import {ApolloCache, ApolloQueryResult, FetchResult} from '@apollo/client';
import {onBeforeMount, onServerPrefetch, Ref, ref} from 'vue';
import {useSSR} from 'src/store/ssr';
import {i18n} from 'boot/i18n';
import {QUERIES} from 'src/data/queries/QUERIES';

/**
 * This file contains a collection of helper functions for querying and mutating data using GraphQL/Apollo.
 */

/**
 * Executes a given GraphQL query object
 * @param {QueryObject} queryObject - the query object constant (from QUERIES.ts)
 * @param {Record<string, unknown>} [variables] - variables to pass to the query, if any
 * @returns {Promise<ApolloQueryResult<Record<string, unknown[] | unknown>>>} - the query's output
 */
async function executeQuery(queryObject: QueryObject, variables?: Record<string, unknown>): Promise<ApolloQueryResult<Record<string, unknown[] | unknown>>> {
  const queryResult = useQuery(queryObject.query, variables ?? {})

  // If we have a cached result, return immediately
  if(queryResult.result.value){
    return {
      data: queryResult.result.value as Record<string, unknown[]>,
      loading: false,
    } as ApolloQueryResult<Record<string, unknown[]>>
  }

  return new Promise(((resolve, reject) => {
    queryResult.onResult((res)=>{
      resolve(res)
    })
    queryResult.onError((err)=>{
      reject(err)
    })
  }))
}

/**
 * Executes a given GraphQL mutation object, automatically handling cache by re-fetching affected queries
 * @param {MutationObject} mutationObject - the mutation object constant (from MUTATIONS.ts)
 * @param {Record<string, unknown>} variables - any variables that shall be passed to the mutatio
 * @returns {Promise<FetchResult<any, Record<string, any>, Record<string, any>> | null>} Returns the values defined by the mutation
 */
async function executeMutation(mutationObject: MutationObject, variables: Record<string, unknown>): Promise<FetchResult<any, Record<string, any>, Record<string, any>> | null> {
  const mutation =  mutationObject.mutation
  const tables =  mutationObject.tables
  const type =  mutationObject.type

  if([mutation, tables, type].some(item => item === undefined)){
    throw new Error(i18n.global.t('errors.missing_properties'))
  }

  const affectedQueries:QueryObject[] = [];

  // Find affected queries based on tables for CREATE and DELETE operations
  if(type === MutationTypes.CREATE || type === MutationTypes.DELETE){
    QUERIES.forEach((query: QueryObject) => {
      // If any of the mutation's affected tables are relevant to query, add to list of affected queries
      if(tables.some(t => query.tables.indexOf(t) >= 0)){
        affectedQueries.push(query)
      }
    })
  }

  // Actually execute mutation and handle cache
  const { mutate } = useMutation(mutation, () => ({
    // Get cache and the new or deleted object
    update: (cache: ApolloCache<any> , { data: changeData}) => {
      updateAffectedQueries(
        cache,
        affectedQueries,
        changeData as Record<string, Record<string, unknown>>,
        mutationObject
      )
    },
  }))
  // Execute mutation
  return await mutate(variables);
}

/**
 * Updates all queries affected by a mutation
 * @param {ApolloCache<any>} cache - Apollo cache
 * @param {QueryObject[]} affectedQueries - all affected queries
 * @param {Record<string, Record<string, unknown>>} changes - data changes
 * @param {MutationObject} mutationObject - the mutation that triggered the change
 * @returns {void}
 */
function updateAffectedQueries(cache: ApolloCache<any>, affectedQueries: QueryObject[], changes: Record<string, Record<string, unknown>>, mutationObject: MutationObject){
  affectedQueries.forEach((queryObject) => {
    if(!mutationObject.cacheLocation){
      throw new Error(i18n.global.t('errors.cache_location_missing') + JSON.stringify(mutationObject))
    }

    const change: Record<string, unknown> = changes[mutationObject.cacheLocation] ?? {}

    // Read existing query from cache
    const data:Record<string, Array<Record<string, unknown>>>|null = cache.readQuery({ query: queryObject.query })

    const type =  mutationObject.type

    if(data) {
      // Determine cache location
      const cacheLocation = queryObject.cacheLocation
      const oldData: Array<Record<string, unknown>> = data[cacheLocation]
      let newData

      // Case 1: CREATE (adds new object to cache)
      if (type === MutationTypes.CREATE) {
        newData = [...oldData, change]
      }
      // Case 2: DELETE (removes object from cache)
      else if (type === MutationTypes.DELETE) {
        newData = oldData.filter((dataPoint: Record<string, unknown>) => dataPoint.uuid !== change.uuid)
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
}

/**
 * Subscribes to a graphQL query
 * @param {QueryObject} query - the graphQL query object
 * @param {Record<string, unknown>} [variables] - any variables to pass to the query
 * @returns {Ref<Record<string, Record<string, unknown>[]>[] | Record<string, unknown[]> | undefined>} - the query's output
 */
function subscribeToQuery(query: QueryObject, variables?: Record<string, unknown>): Ref<Record<string, Record<string, unknown>[]>[] | Record<string, unknown[]> | undefined>{
  const $ssrStore = useSSR();
  const res: Ref<Record<string, Record<string, unknown>[]>[]> = ref([])

  // ----- Hooks -----
  onServerPrefetch(async () => {
    const tempRes: ApolloQueryResult<Record<string, any>> = await executeQuery(query, variables)
    if(!tempRes.data){ return}
    res.value = tempRes.data[query.cacheLocation] as Record<string, Record<string, unknown>[]>[]
    $ssrStore.mutations.setPrefetchedData({key: query.cacheLocation, value: res.value})
  })

  onBeforeMount( () => {
    const apolloClient = useApolloClient().resolveClient()
    const current_cache_state = apolloClient.readQuery({query: query.query, variables}) as Record<string, Record<string, unknown>[]>[] ?? []
    // Test if the query is already in the cache
    if(Object.values(current_cache_state).length === 0){
      res.value = $ssrStore.getters.getPrefetchedData()(query.cacheLocation) as Record<string, Record<string, unknown>[]>[] ?? []

      // SPA
      if(res.value.length <= 0){
        void executeQuery(query, variables).then((fetchedRes: ApolloQueryResult<Record<string, unknown>>)=>{
          if(fetchedRes.data){
            res.value = fetchedRes.data[query.cacheLocation] as Record<string, Record<string, unknown>[]>[]
          } else {
            res.value = []
          }
        })
      } else {
        // SSR
        apolloClient.writeQuery({
          query: query.query,
          variables: variables,
          data: {
            [query.cacheLocation]: res.value
          }
        })
      }
    }

    apolloClient.watchQuery({query: query.query, variables: variables}).subscribe({
      next(value: ApolloQueryResult<Record<string, unknown>>) {
        res.value = value.data[query.cacheLocation] as Record<string, Record<string, unknown>[]>[]
      }
    })
  })
  return res;
}


export {executeQuery, executeMutation, subscribeToQuery}
