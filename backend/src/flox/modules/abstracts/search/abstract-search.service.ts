import { SearchArgs } from './dto/args/search.args';
import SearchQueryOutputInterface from './outputs/search-interface.output';
import { FindOptionsOrder, FindOptionsWhere, Like, Repository } from 'typeorm';
import { BaseEntity } from '../../../core/base-entity/entities/base-entity.entity';
import { AbstractCrudService } from '../crud/abstract-crud.service';

export abstract class AbstractSearchService<
  Entity extends BaseEntity,
> extends AbstractCrudService<Entity> {
  abstract get repository(): Repository<Entity>;

  /**
   * Queries for all rows that fit query criteria, best used in combination with the DataTable
   * @param queryArgs - contain table filtering rules
   * @param searchKey - key on which search string value is being searched
   * @returns data that fit criteria
   */
  async search(
    queryArgs: SearchArgs,
    searchKey: keyof Entity,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    const count = await this.repository.count({
      where: {
        [searchKey]: Like(`%${queryArgs.filter}%`),
      } as FindOptionsWhere<Entity>,
    });

    const data = await this.repository.find({
      order: {
        [queryArgs.sortBy]: queryArgs.descending ? 'DESC' : 'ASC',
      } as FindOptionsOrder<Entity>,
      skip: queryArgs.skip,
      take: queryArgs.take,
      where: {
        [searchKey]: Like(`%${queryArgs.filter}%`),
      } as FindOptionsWhere<Entity>,
    });
    return { data, count };
  }
}
