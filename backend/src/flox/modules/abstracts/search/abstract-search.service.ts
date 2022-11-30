import {
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Like,
  Repository,
} from 'typeorm';

import BaseEntity from '../../../core/base-entity/entities/base-entity.entity';
import AbstractCrudService from '../crud/abstract-crud.service';

import SearchArgs from './dto/args/search.args';
import SearchQueryOutputInterface from './outputs/search-interface.output';

export default abstract class AbstractSearchService<
  Entity extends BaseEntity,
> extends AbstractCrudService<Entity> {
  abstract get repository(): Repository<Entity>;

  /**
   * Assembles options to search provided filter on given keys
   *
   * @param searchKeys - list of search  keys that are scanned
   * @param filter - value that is searched on keys
   * @returns where options including Like-searches
   */
  private nestedSearch(
    searchKeys: (keyof Entity | string)[],
    filter: string,
  ): FindOptionsWhere<Entity>[] {
    return searchKeys.map((key) => {
      if ((key as string).includes('.')) {
        const [entity, value] = (key as string).split('.');
        return {
          [entity]: {
            [value]: Like(`%${filter}%`),
          },
        } as FindOptionsWhere<Entity>;
      }
      return {
        [key]: Like(`%${filter}%`),
      } as FindOptionsWhere<Entity>;
    });
  }

  /**
   * Queries for all rows that fit query criteria, best used in combination with the DataTable
   *
   * @param searchQueryArgs - contain table filtering rules
   * @param searchKeys - key on which search string value is being searched
   * @param options - options to extend search query
   * @returns data that fit criteria
   */
  async search(
    searchQueryArgs: SearchArgs,
    searchKeys: (keyof Entity | string)[],
    options?: FindOneOptions<Entity>,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    const [data, count] = await this.repository.findAndCount({
      ...options,
      order: {
        [searchQueryArgs.sortBy]: searchQueryArgs.descending ? 'DESC' : 'ASC',
      } as FindOptionsOrder<Entity>,
      skip: searchQueryArgs.skip,
      take: searchQueryArgs.take,
      where: this.nestedSearch(searchKeys, searchQueryArgs.filter),
    });
    return { data, count };
  }
}
