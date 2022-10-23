import { SearchQueryArgs } from './dto/args/search-query.args';
import SearchQueryOutputInterface from './outputs/search-query-interface.output';

export interface SearchQueryInterfaceService {
  /**
   * Queries for all rows that fit query criteria, best used in combination with the DataTable
   * @param queryArgs - contain table filtering rules
   * @returns data that fit criteria
   */
  queryAll(
    queryArgs: SearchQueryArgs,
  ): Promise<SearchQueryOutputInterface<Record<string, any>>>;
}
