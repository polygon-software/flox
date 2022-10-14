import { FetchResult } from '@apollo/client';
import { OperationVariables } from '@apollo/client/core/types';
import { useMutation } from '@vue/apollo-composable';
import { DocumentNode } from 'graphql';

import { invalidateTables } from 'src/apollo/invalidation';
import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import ExtendedEntity from 'src/flox/modules/interfaces/entities/extended.entity';

export interface MutationObject {
  mutation: DocumentNode; // Actual GraphQL mutation
  tables: string[]; // Affected Tables
  cacheLocation: string; // Location in cache (actual GraphQL query name)
  type: MutationTypes; // Type of mutation
}

export enum MutationTypes {
  CREATE,
  UPDATE,
  DELETE,
  DEVALIDATINGUPDATE, // An update that devalidates other tables
}

/**
 * Executes a given GraphQL mutation object, automatically handling cache by re-fetching affected queries
 *
 * @param updateObject - the mutation object constant (from MUTATIONS.ts)
 * @param variables - any variables that shall be passed to the mutation
 * @returns Returns the values defined by the mutation
 */
export async function executeMutation<
  T extends BaseEntity | ExtendedEntity<any>
>(
  updateObject: MutationObject,
  variables: OperationVariables
): Promise<FetchResult<T | null>> {
  const { mutation } = updateObject;

  // Actually execute mutation and handle cache
  const { mutate } = useMutation<Record<string, T> | null>(mutation, () => ({
    // Get cache and the new or deleted object
    update: (): void => {
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
  } as FetchResult<T>;
}
