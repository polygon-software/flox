import { FindOneOptions } from 'typeorm';

import BaseEntity from '../../../core/base-entity/entities/base-entity.entity';
import AbstractCrudResolver from '../crud/abstract-crud.resolver';

import SearchArgs from './dto/args/search.args';
import SearchQueryOutputInterface from './outputs/search-interface.output';
import AbstractSearchService from './abstract-search.service';

export default abstract class AbstractSearchResolver<
  Entity extends BaseEntity,
  Service extends AbstractSearchService<Entity>,
> extends AbstractCrudResolver<Entity, Service> {
  abstract get service(): Service;

  protected constructor(private searchKeys: (keyof Entity)[]) {
    super();
  }

  /**
   * Queries for all rows that fit query criteria, best used in combination with the DataTable
   *
   * @param searchQueryArgs - contain table filtering rules
   * @param options - options to extend search query
   * @returns data that fit criteria
   */
  search(
    searchQueryArgs: SearchArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    return this.service.search(searchQueryArgs, this.searchKeys, options);
  }
}
