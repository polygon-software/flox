import { SearchQueryArgs } from './dto/args/search-query.args';
import SearchQueryOutputInterface from './outputs/search-query-interface.output';

export interface SearchQueryInterfaceService {
  /**
   * Queries for all rows that fit query criteria, best used in combination with the DataTable
   * @param {SearchQueryArgs} queryArgs - contain table filtering rules
   * @returns {Promise<SearchQueryResultsInterface<Record<string, any>>>} data that fit criteria
   */
  queryAll(
    queryArgs: SearchQueryArgs,
  ): Promise<SearchQueryOutputInterface<Record<string, any>>>;
}
