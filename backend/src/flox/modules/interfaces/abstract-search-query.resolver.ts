import { SearchQueryArgs } from './dto/args/search-query.args';
import SearchQueryOutputInterface from './outputs/search-query-interface.output';
import { AbstractSearchQueryService } from './abstract-search-query.service';
import { BaseEntity } from '../../core/base-entity/entities/base-entity.entity';

export abstract class AbstractSearchQueryResolver<
  Entity extends BaseEntity,
  Service extends AbstractSearchQueryService<Entity>,
> {
  abstract get service(): Service;

  protected constructor(private searchKey: keyof Entity) {}

  /**
   * Queries for all rows that fit query criteria, best used in combination with the DataTable
   * @param queryArgs - contain table filtering rules
   * @returns data that fit criteria
   */
  queryAll(
    queryArgs: SearchQueryArgs,
  ): Promise<SearchQueryOutputInterface<Record<string, any>>> {
    return this.service.queryAll(queryArgs, this.searchKey);
  }
}
