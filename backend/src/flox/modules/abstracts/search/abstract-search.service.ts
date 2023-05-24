import {
  Between,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  Repository,
} from 'typeorm';

import BaseEntity from '../../../core/base-entity/entities/base-entity.entity';
import AbstractCrudService from '../crud/abstract-crud.service';

import SearchArgs from './dto/args/search.args';
import SearchQueryOutputInterface from './dto/output/search-interface.output';

export default abstract class AbstractSearchService<
  Entity extends BaseEntity,
> extends AbstractCrudService<Entity> {
  abstract get repository(): Repository<Entity>;

  /**
   * Queries for all rows that fit query criteria, best used in combination with the DataTable
   *
   * @param searchArgs - contain table filtering rules
   * @param searchKeys - key on which search string value is being searched
   * @param options - options to extend search query
   * @returns data that fit criteria
   */
  async search(
    searchArgs: SearchArgs,
    searchKeys: (keyof Entity | string)[],
    options?: FindOneOptions<Entity>,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    // Build search keys, taking searchArgs into consideration (only those within searchKeys are allowed)
    const correctedKeys = searchArgs.searchKeys ?? searchKeys;

    // If custom keys are given, check for invalid ones & throw error
    if (searchArgs?.searchKeys) {
      const invalidKeys = searchArgs.searchKeys.filter(
        (key) => !searchKeys.includes(key),
      );
      if (invalidKeys) {
        throw new Error(
          `Invalid searchQuery keys given: ${invalidKeys.toString()}`,
        );
      }
    }

    let whereClause: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[] = [];

    if (searchArgs?.searchTerm) {
      whereClause.push(
        ...this.nestedSearch(correctedKeys, searchArgs.searchTerm),
      );
    }

    if (searchArgs?.filter) {
      const filter = this.nestedDateFilter(searchArgs.filter);
      whereClause =
        whereClause.length > 0
          ? whereClause.map((whereStatement): FindOptionsWhere<Entity> => {
              return { ...whereStatement, ...filter };
            })
          : (filter as FindOptionsWhere<Entity>);
    }

    const [data, count] = await this.repository.findAndCount({
      ...options,
      order: searchArgs?.sortBy
        ? ({
            [searchArgs.sortBy]: searchArgs.descending ? 'DESC' : 'ASC',
          } as FindOptionsOrder<Entity>)
        : undefined,
      skip: searchArgs.skip,
      take: searchArgs.take,
      where: whereClause,
    });
    return { data, count };
  }

  /**
   * Recursively searches for date values and replaces them with a between statement for the whole day
   *
   * @param filter - filter object to search for date values
   * @returns filter object with date values replaced with between statement
   * @private
   */
  private nestedDateFilter(filter: Record<string, any>): Record<string, any> {
    return Object.entries(filter).reduce((acc, [key, value]) => {
      if (value instanceof Date) {
        return {
          ...acc,
          [key]: Between(
            new Date(value),
            new Date(value.setHours(value.getHours() + 23, 59, 59, 999)),
          ),
        };
      }
      if (typeof value === 'object') {
        return {
          ...acc,
          [key]: this.nestedDateFilter(value as Record<string, any>),
        };
      }
      return {
        ...acc,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        [key]: value,
      };
    }, {});
  }

  /**
   * Assembles options to search provided searchTerm on given keys
   *
   * @param searchKeys - list of search  keys that are scanned
   * @param searchTerm - value that is searched on keys
   * @returns where options including Like-searches
   */
  private nestedSearch(
    searchKeys: (keyof Entity | string)[],
    searchTerm: string,
  ): FindOptionsWhere<Entity>[] {
    return searchKeys.map((key) => {
      if ((key as string).includes('.')) {
        const [entity, value] = (key as string).split('.');
        return {
          [entity]: {
            [value]: ILike(`%${searchTerm}%`),
          },
        } as FindOptionsWhere<Entity>;
      }
      return {
        [key]: ILike(`%${searchTerm}%`),
      } as FindOptionsWhere<Entity>;
    });
  }
}
