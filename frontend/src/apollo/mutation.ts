import {BaseEntity} from 'src/flox/core/base-entity/entities/BaseEntity';
import {OperationVariables} from '@apollo/client/core/types';
import {FetchResult} from '@apollo/client';
import {useMutation} from '@vue/apollo-composable';
import {invalidateTables} from 'src/apollo/invalidation';
import {DocumentNode} from 'graphql';

export interface MutationObject {
  mutation: DocumentNode,          // Actual GraphQL mutation
  tables: string[],       // Affected Tables
  cacheLocation: string,  // Location in cache (actual GraphQL query name)
  type: MutationTypes     // Type of mutation
}

export enum MutationTypes {
  CREATE,
  UPDATE,
  DELETE,
  DEVALIDATINGUPDATE, // An update that devalidates other tables
}

/**
 * Executes a given GraphQL mutation object, automatically handling cache by re-fetching affected queries
 * @param {MutationObject} updateObject - the mutation object constant (from MUTATIONS.ts)
 * @param {OperationVariables} variables - any variables that shall be passed to the mutation
 * @returns {Promise<FetchResult<T | null> | null>} Returns the values defined by the mutation
 */
export async function executeMutation<T extends BaseEntity>(
  updateObject: MutationObject,
  variables: OperationVariables
): Promise<FetchResult<T | null>> {
  const mutation = updateObject.mutation;

  // Actually execute mutation and handle cache
  const { mutate } = useMutation<Record<string, T> | null>(mutation, () => ({
    // Get cache and the new or deleted object
    update: () => {
      // Re-fetch all affected queries
      invalidateTables(updateObject.tables);
    },
  }));
  // Execute mutation
  const mutationResult = await mutate(variables);
  if (mutationResult && mutationResult.data) {
    return {
      data: mutationResult.data[updateObject.cacheLocation],
    } as FetchResult<T>;
  }
  return {
    data: null,
  };
}
