import { flatten, unflatten } from 'flat';
import { isEqual, pick } from 'lodash-es';
import { ExecutableDefinitionNode } from 'graphql/language/ast';
import { BaseEntity } from 'src/flox/core/base-entity/entities/BaseEntity';
import { MutationObject } from 'src/apollo/mutation';

type primitive = number | string | boolean | null | undefined;

/**
 * Returns an object containing only keys that have changed between the original and modified object. The contained
 * values are the ones from the modified object. This method works on deeply nested objects.
 * Note that added or removed keys are ignored.
 * @param original - original object
 * @param modified - copy of original that does contain some changes
 * @returns changes within object from original to modified
 */
export function objectChange(
  original: Record<string, any>,
  modified: Record<string, any>
): Record<string, any> {
  const flattenFunc = flatten as (
    obj: Record<string, any>
  ) => Record<string, primitive>;
  const unflattenFunc = unflatten as (
    obj: Record<string, primitive>
  ) => Record<string, any>;

  const originalFlat = flattenFunc(original);
  const modifiedFlat = flattenFunc(modified);

  const diffFlat: Record<string, primitive> = {};

  Object.entries(originalFlat).forEach(([key, value1]) => {
    if (key in modifiedFlat && !isEqual(value1, modifiedFlat[key])) {
      diffFlat[key] = modifiedFlat[key];
    }
  });
  return unflattenFunc(diffFlat);
}

/**
 * Extracts the name of all variables from a mutation query
 * @param {MutationObject} mutation - object defining mutation
 * @returns {string[]} list of variable names
 */
export function extractMutationVariableNames(
  mutation: MutationObject
): string[] {
  return mutation.mutation.definitions
    .map((def) => (def as ExecutableDefinitionNode).variableDefinitions)
    .flat()
    .map((variableDef) => variableDef?.variable.name.value)
    .filter(Boolean) as string[];
}

/**
 * Returns the subset of an object that is required for a mutation
 * @param {BaseEntity} entity - modified entity that should be saved
 * @param {MutationObject} mutation - update mutation containing variables that define update keys
 * @returns {Record<string, any>} - Subset of entity with only the keys relevant for the mutation
 */
export function entityToMutationVariables(
  entity: BaseEntity,
  mutation: MutationObject
): Record<string, any> {
  const variables = extractMutationVariableNames(mutation);
  return pick(entity, variables);
}
