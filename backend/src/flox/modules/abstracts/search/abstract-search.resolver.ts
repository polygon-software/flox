import { BaseEntity } from '../../../core/base-entity/entities/base-entity.entity';
import { AbstractCrudResolver } from '../crud/abstract-crud.resolver';

import { SearchArgs } from './dto/args/search.args';
import SearchQueryOutputInterface from './outputs/search-interface.output';
import { AbstractSearchService } from './abstract-search.service';

export abstract class AbstractSearchResolver<
  Entity extends BaseEntity,
  Service extends AbstractSearchService<Entity>,
> extends AbstractCrudResolver<Entity, Service> {
  abstract get service(): Service;

  protected constructor(private searchKey: keyof Entity) {
    super();
  }

  /**
   * Queries for all rows that fit query criteria, best used in combination with the DataTable
   * @param queryArgs - contain table filtering rules
   * @returns data that fit criteria
   */
  search(queryArgs: SearchArgs): Promise<SearchQueryOutputInterface<Entity>> {
    return this.service.search(queryArgs, this.searchKey);
  }
}
