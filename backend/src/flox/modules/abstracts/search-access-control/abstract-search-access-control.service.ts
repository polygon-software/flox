import { AccessControlledEntity } from '../../access-control/entities/access-controlled.entity';
import { AbstractCrudAccessControlService } from '../crud-access-control/abstract-crud-access-control.service';
import { FindOptionsOrder, FindOptionsWhere, Like, Repository } from 'typeorm';
import { SearchArgs } from '../search/dto/args/search.args';
import SearchQueryOutputInterface from '../search/outputs/search-interface.output';
import { User } from '../../auth/entities/user.entity';

export abstract class AbstractSearchAccessControlService<
  Entity extends AccessControlledEntity,
> extends AbstractCrudAccessControlService<Entity> {
  abstract get repository(): Repository<Entity>;

  /**
   * Queries for all rows that fit query criteria, best used in combination with the DataTable
   * @param queryArgs - contain table filtering rules
   * @param searchKey - key on which search string value is being searched
   * @returns data that fit criteria
   */
  async searchPublic(
    queryArgs: SearchArgs,
    searchKey: keyof Entity,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    const where = {
      publicReadAccess: true,
      [searchKey]: Like(`%${queryArgs.filter}%`),
    } as FindOptionsWhere<Entity>;

    const count = await this.repository.count({
      where,
    });

    const data = await this.repository.find({
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
    searchKey: keyof Entity,
    user: User,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    const where = [
      {
        publicReadAccess: true,
        [searchKey]: Like(`%${queryArgs.filter}%`),
      } as FindOptionsWhere<Entity>,
      {
        loggedInReadAccess: true,
        [searchKey]: Like(`%${queryArgs.filter}%`),
      } as FindOptionsWhere<Entity>,
      {
        owner: {
          uuid: user.uuid,
        },
        [searchKey]: Like(`%${queryArgs.filter}%`),
      } as FindOptionsWhere<Entity>,
      {
        readAccess: {
          users: {
            uuid: user.uuid,
          },
        },
        [searchKey]: Like(`%${queryArgs.filter}%`),
      } as FindOptionsWhere<Entity>,
    ];
    const count = await this.repository.count({
      where,
    });

    const data = await this.repository.find({
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
    searchKey: keyof Entity,
    user: User,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    const where = [
      {
        owner: {
          uuid: user.uuid,
        },
        [searchKey]: Like(`%${queryArgs.filter}%`),
      } as FindOptionsWhere<Entity>,
      {
        readAccess: {
          users: {
            uuid: user.uuid,
          },
        },
        [searchKey]: Like(`%${queryArgs.filter}%`),
      } as FindOptionsWhere<Entity>,
    ];
    const count = await this.repository.count({
      where,
    });

    const data = await this.repository.find({
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
    searchKey: keyof Entity,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    const where = {
      [searchKey]: Like(`%${queryArgs.filter}%`),
    } as FindOptionsWhere<Entity>;
    const count = await this.repository.count({
      where,
    });

    const data = await this.repository.find({
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
