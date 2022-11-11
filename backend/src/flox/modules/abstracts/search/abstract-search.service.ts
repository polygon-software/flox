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

  private nestedSearch(
    searchKeys: (keyof Entity)[],
    filter: string,
  ): FindOptionsWhere<Entity>[] {
    return searchKeys.map(
      (key) =>
        ({
          [key]: Like(`%${filter}%`),
        } as FindOptionsWhere<Entity>),
    );
  }

  /**
   * Queries for all rows that fit query criteria, best used in combination with the DataTable
   * @param searchQueryArgs - contain table filtering rules
   * @param searchKeys - key on which search string value is being searched
   * @param options - options to extend search query
   * @returns data that fit criteria
   */
  async search(
    searchQueryArgs: SearchArgs,
    searchKeys: (keyof Entity)[],
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
