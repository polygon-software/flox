import { SearchQueryArgs } from './dto/args/search-query.args';
import SearchQueryOutputInterface from './outputs/search-query-interface.output';
import { BaseEntity } from '../../../core/base-entity/entities/base-entity.entity';
import { AbstractCrudResolver } from '../crud/abstract-crud.resolver';
import { AbstractSearchQueryService } from './abstract-search-query.service';

export abstract class AbstractSearchQueryResolver<
  Entity extends BaseEntity,
  Service extends AbstractSearchQueryService<Entity>,
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
  queryAll(
    queryArgs: SearchQueryArgs,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    return this.service.queryAll(queryArgs, this.searchKey);
  }
}
