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
   * Queries for all rows that fit query criteria, best used in combination with the DataTable
   * @param searchQueryArgs - contain table filtering rules
   * @param searchKey - key on which search string value is being searched
   * @param options - options to extend search query
   * @returns data that fit criteria
   */
  async search(
    searchQueryArgs: SearchArgs,
    searchKey: keyof Entity,
    options?: FindOneOptions<Entity>,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    const [data, count] = await this.repository.findAndCount({
      ...options,
      order: {
        [searchQueryArgs.sortBy]: searchQueryArgs.descending ? 'DESC' : 'ASC',
      } as FindOptionsOrder<Entity>,
      skip: searchQueryArgs.skip,
      take: searchQueryArgs.take,
      where: {
        [searchKey]: Like(`%${searchQueryArgs.filter}%`),
      } as FindOptionsWhere<Entity>,
    });
    return { data, count };
  }
}
