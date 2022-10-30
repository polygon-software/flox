import { unflatten } from 'flat';
import {
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Like,
  Repository,
} from 'typeorm';

import AccessControlledEntity from '../../access-control/entities/access-controlled.entity';
import User from '../../auth/entities/user.entity';
import AbstractCrudAccessControlService from '../crud-access-control/abstract-crud-access-control.service';
import SearchArgs from '../search/dto/args/search.args';
import SearchQueryOutputInterface from '../search/outputs/search-interface.output';

import type { NestedKeyOf } from 'src/types/NestedKeyOf';

export default abstract class AbstractSearchAccessControlService<
  Entity extends AccessControlledEntity,
> extends AbstractCrudAccessControlService<Entity> {
  abstract get repository(): Repository<Entity>;

  private nestedSearch(
    searchKey: NestedKeyOf<Entity>,
    filter: string,
  ): FindOptionsWhere<Entity> {
    return unflatten({
      [searchKey]: Like(`%${filter}%`),
    });
  }

  /**
   * Queries for all rows that fit query criteria, best used in combination with the DataTable
   * @param queryArgs - contain table filtering rules
   * @param searchKey - key on which search string value is being searched
   * @param options - query options to extend search
   * @returns data that fit criteria
   */
  async searchPublic(
    queryArgs: SearchArgs,
    searchKey: NestedKeyOf<Entity>,
    options?: FindOneOptions<Entity>,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    const where = this.mixWhere(
      [
        {
          publicReadAccess: true,
          ...this.nestedSearch(searchKey, queryArgs.filter),
        },
      ] as FindOptionsWhere<Entity>[],
      this.extractWhere(options),
    );

    const count = await this.repository.count({
      ...options,
      where,
    });

    const data = await this.repository.find({
      ...options,
      order: {
        [queryArgs.sortBy]: queryArgs.descending ? 'DESC' : 'ASC',
      } as FindOptionsOrder<Entity>,
      skip: queryArgs.skip,
      take: queryArgs.take,
      where,
    });
    return { data, count };
  }

  async searchAsUser(
    queryArgs: SearchArgs,
    searchKey: NestedKeyOf<Entity>,
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    const where = this.mixWhere(
      [
        {
          publicReadAccess: true,
          ...this.nestedSearch(searchKey, queryArgs.filter),
        } as FindOptionsWhere<Entity>,
        {
          loggedInReadAccess: true,
          ...this.nestedSearch(searchKey, queryArgs.filter),
        } as FindOptionsWhere<Entity>,
        {
          owner: {
            uuid: user.uuid,
          },
          ...this.nestedSearch(searchKey, queryArgs.filter),
        } as FindOptionsWhere<Entity>,
        {
          readAccess: {
            users: {
              uuid: user.uuid,
            },
          },
          ...this.nestedSearch(searchKey, queryArgs.filter),
        } as FindOptionsWhere<Entity>,
      ],
      this.extractWhere(options),
    );
    const count = await this.repository.count({
      ...options,
      where,
    });

    const data = await this.repository.find({
      ...options,
      order: {
        [queryArgs.sortBy]: queryArgs.descending ? 'DESC' : 'ASC',
      } as FindOptionsOrder<Entity>,
      skip: queryArgs.skip,
      take: queryArgs.take,
      where,
    });
    return { data, count };
  }

  async searchOfUser(
    queryArgs: SearchArgs,
    searchKey: NestedKeyOf<Entity>,
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    const where = this.mixWhere(
      [
        {
          owner: {
            uuid: user.uuid,
          },
          ...this.nestedSearch(searchKey, queryArgs.filter),
        } as FindOptionsWhere<Entity>,
        {
          readAccess: {
            users: {
              uuid: user.uuid,
            },
          },
          ...this.nestedSearch(searchKey, queryArgs.filter),
        } as FindOptionsWhere<Entity>,
      ],
      this.extractWhere(options),
    );
    const count = await this.repository.count({
      ...options,
      where,
    });

    const data = await this.repository.find({
      ...options,
      order: {
        [queryArgs.sortBy]: queryArgs.descending ? 'DESC' : 'ASC',
      } as FindOptionsOrder<Entity>,
      skip: queryArgs.skip,
      take: queryArgs.take,
      where,
    });
    return { data, count };
  }

  async searchAsAdmin(
    queryArgs: SearchArgs,
    searchKey: NestedKeyOf<Entity>,
    options?: FindOneOptions<Entity>,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    const where = this.mixWhere(
      [
        {
          ...this.nestedSearch(searchKey, queryArgs.filter),
        },
      ] as FindOptionsWhere<Entity>[],
      this.extractWhere(options),
    );
    const count = await this.repository.count({
      ...options,
      where,
    });

    const data = await this.repository.find({
      ...options,
      order: {
        [queryArgs.sortBy]: queryArgs.descending ? 'DESC' : 'ASC',
      } as FindOptionsOrder<Entity>,
      skip: queryArgs.skip,
      take: queryArgs.take,
      where,
    });
    return { data, count };
  }
}
