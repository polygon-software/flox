import {
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  Like,
  Repository,
} from 'typeorm';

import AccessControlledEntity from '../../access-control/entities/access-controlled.entity';
import User from '../../auth/entities/user.entity';
import AbstractCrudAccessControlService from '../crud-access-control/abstract-crud-access-control.service';
import SearchArgs from '../search/dto/args/search.args';
import SearchQueryOutputInterface from '../search/dto/output/search-interface.output';
import { mixWhere } from '../crud/helpers/crud.helper';

export default abstract class AbstractSearchAccessControlService<
  Entity extends AccessControlledEntity,
> extends AbstractCrudAccessControlService<Entity> {
  abstract get repository(): Repository<Entity>;

  /**
   * Queries for all entities that fit query criteria. It only returns the entities that are marked with
   * public read access.
   *
   * @param queryArgs - contain table filtering rules
   * @param searchKeys - key on which search string value is being searched
   * @param options - query options to extend search
   * @returns data that fit criteria
   */
  async searchPublic(
    queryArgs: SearchArgs,
    searchKeys: (keyof Entity)[],
    options?: FindOneOptions<Entity>,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    const where = mixWhere<Entity>(
      [
        {
          publicReadAccess: true,
        } as FindOptionsWhere<Entity>,
      ],
      queryArgs.searchTerm
        ? this.nestedSearch(searchKeys, queryArgs.searchTerm)
        : [],
    );

    const [data, count] = await this.repository.findAndCount({
      ...options,
      order: queryArgs?.sortBy
        ? ({
            [queryArgs.sortBy]: queryArgs.descending ? 'DESC' : 'ASC',
          } as FindOptionsOrder<Entity>)
        : undefined,
      skip: queryArgs.skip,
      take: queryArgs.take,
      where,
    });
    return { data, count };
  }

  /**
   * Queries for all entities that fit query criteria. It only returns the entities that are public, the
   * user is the owner or the user is part of an access group that has read access to these items.
   *
   * @param queryArgs - contain table filtering rules
   * @param searchKeys - key on which search string value is being searched
   * @param user - user that retrieves entities
   * @param options - query options to extend search
   * @returns data that fit criteria
   */
  async searchAsUser(
    queryArgs: SearchArgs,
    searchKeys: (keyof Entity)[],
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    const [publicReadUuids, loggedInReadUuids, ownerUuids, readUuids] =
      await Promise.all([
        this.findUuidsForPublicReadAccess(options),
        this.findUuidsForLoggedInReadAccess(options),
        this.findUuidsForOwner(user, options),
        this.findUuidsWithReadAccess(user, options),
      ]);

    const where = mixWhere<Entity>(
      [
        {
          uuid: In([
            ...publicReadUuids,
            ...loggedInReadUuids,
            ...ownerUuids,
            ...readUuids,
          ]),
        } as FindOptionsWhere<Entity>,
      ],
      queryArgs?.searchTerm
        ? this.nestedSearch(searchKeys, queryArgs.searchTerm)
        : [],
    );

    const [data, count] = await this.repository.findAndCount({
      ...options,
      where,
      order: queryArgs?.sortBy
        ? ({
            [queryArgs.sortBy]: queryArgs.descending ? 'DESC' : 'ASC',
          } as FindOptionsOrder<Entity>)
        : undefined,
      skip: queryArgs.skip,
      take: queryArgs.take,
    });
    return { data, count };
  }

  /**
   * Queries for all entities that fit query criteria. It only returns the entities that the
   * user is the owner or the user is part of an access group that has read access to these items. This
   * endpoint does not return public items, though, since they do not explicitely belong to the user.
   *
   * @param queryArgs - contain table filtering rules
   * @param searchKeys - key on which search string value is being searched
   * @param user - user that retrieves entities
   * @param options - query options to extend search
   * @returns data that fit criteria
   */
  async searchOfUser(
    queryArgs: SearchArgs,
    searchKeys: (keyof Entity)[],
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    const [ownerUuids, readUuids] = await Promise.all([
      this.findUuidsForOwner(user, options),
      this.findUuidsWithReadAccess(user, options),
    ]);

    const where = mixWhere<Entity>(
      [
        {
          uuid: In([...ownerUuids, ...readUuids]),
        } as FindOptionsWhere<Entity>,
      ],
      queryArgs?.searchTerm
        ? this.nestedSearch(searchKeys, queryArgs.searchTerm)
        : [],
    );

    const [data, count] = await this.repository.findAndCount({
      ...options,
      where,
      order: queryArgs?.sortBy
        ? ({
            [queryArgs.sortBy]: queryArgs.descending ? 'DESC' : 'ASC',
          } as FindOptionsOrder<Entity>)
        : undefined,
      skip: queryArgs.skip,
      take: queryArgs.take,
    });
    return { data, count };
  }

  /**
   * Queries for all entities that fit query criteria. This service function must be
   * used with caution and should only be used for resolvers that are marked as @AdminOnly
   *
   * @param queryArgs - contain table filtering rules
   * @param searchKeys - key on which search string value is being searched
   * @param options - query options to extend search
   * @returns data that fit criteria
   */
  async searchAsAdmin(
    queryArgs: SearchArgs,
    searchKeys: (keyof Entity)[],
    options?: FindOneOptions<Entity>,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    const [data, count] = await this.repository.findAndCount({
      ...options,
      where: queryArgs?.searchTerm
        ? this.nestedSearch(searchKeys, queryArgs.searchTerm)
        : undefined,
      order: queryArgs?.sortBy
        ? ({
            [queryArgs.sortBy]: queryArgs.descending ? 'DESC' : 'ASC',
          } as FindOptionsOrder<Entity>)
        : undefined,
      skip: queryArgs.skip,
      take: queryArgs.take,
    });
    return { data, count };
  }

  /**
   * Assembles options to search provided filter on given keys
   *
   * @param searchKeys - list of search  keys that are scanned
   * @param filter - value that is searched on keys
   * @returns where options including Like-searches
   */
  private nestedSearch(
    searchKeys: (keyof Entity | string)[],
    filter: string,
  ): FindOptionsWhere<Entity>[] {
    return searchKeys.map((key) => {
      if ((key as string).includes('.')) {
        const [entity, value] = (key as string).split('.');
        return {
          [entity]: {
            [value]: Like(`%${filter}%`),
          },
        } as FindOptionsWhere<Entity>;
      }
      return {
        [key]: Like(`%${filter}%`),
      } as FindOptionsWhere<Entity>;
    });
  }
}
