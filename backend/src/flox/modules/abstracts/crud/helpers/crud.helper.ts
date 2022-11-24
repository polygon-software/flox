import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import merge from 'lodash/merge';

import BaseEntity from '../../../../core/base-entity/entities/base-entity.entity';

/**
 * Extracts the 'where' part of a typeorm find query and returns it as an array of wheres
 *
 * @param options - from where the 'where' should be extractet
 * @protected
 * @returns array of where queries
 */
export function extractWhere<Entity extends BaseEntity>(
  options?: FindOneOptions<Entity>,
): FindOptionsWhere<Entity>[] {
  const whereOptions: FindOptionsWhere<Entity>[] = [];
  if (options?.where) {
    if (Array.isArray(options.where)) {
      whereOptions.push(...options.where);
    } else {
      whereOptions.push(options.where);
    }
  }
  return whereOptions;
}

/**
 * Mixes two where arrays together. If you have two arrays containing where queries, this method combines each
 * where query with each other, like a zip. This is helpful when you have a list of where clauses provided by the
 * user / developer and a set of security where clauses that shall be applied to each of them - like ensuring only
 * items are retrieved for which the current user has appropriate read access.
 *
 * @param securityWhere - The where clauses that ensure access rights - but could be any list of where clauses
 * @param customWhere - User provided where clauses
 * @example [{w1}, {w2}] x [{w3, w4}] -> [{w1 & w3}, {w1 & w4}, {w2 & w3}, {w2 & w4}]
 * @protected
 * @returns zip of all possible combinations of the two where clauses
 */
export function mixWhere<Entity>(
  securityWhere: FindOptionsWhere<Entity>[],
  customWhere: FindOptionsWhere<Entity>[],
): FindOptionsWhere<Entity>[] {
  if (securityWhere.length === 0) {
    return customWhere;
  }
  if (customWhere.length === 0) {
    return securityWhere;
  }
  return securityWhere
    .map((securityClause) => {
      return customWhere.map((customClause) => {
        return {
          ...securityClause,
          ...customClause,
        };
      });
    })
    .flat();
}

/**
 * Deeply merges two typeorm find queries
 *
 * @param options1 - Any typeorm query option
 * @param options2 - Any other typeorm query option
 * @protected
 * @returns deep merge of the two options
 */
export function mergeOptions<Entity extends BaseEntity>(
  options1?: FindOneOptions<Entity>,
  options2?: FindOneOptions<Entity>,
): FindOneOptions<Entity> {
  if (!options1 && options2) {
    return options2;
  }
  if (!options2 && options1) {
    return options1;
  }
  if (options1 && options2) {
    return merge(options1, options2);
  }
  return {};
}
