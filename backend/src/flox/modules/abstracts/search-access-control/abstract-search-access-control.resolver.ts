import AccessControlledEntity from '../../access-control/entities/access-controlled.entity';
import User from '../../auth/entities/user.entity';
import AbstractCrudAccessControlResolver from '../crud-access-control/abstract-crud-access-control.resolver';
import SearchArgs from '../search/dto/args/search.args';
import SearchQueryOutputInterface from '../search/dto/output/search-interface.output';
import { DefaultRoles } from '../../roles/config';

import AbstractSearchAccessControlService from './abstract-search-access-control.service';

export default abstract class AbstractSearchAccessControlResolver<
  Entity extends AccessControlledEntity,
  Service extends AbstractSearchAccessControlService<Entity>,
> extends AbstractCrudAccessControlResolver<Entity, Service> {
  protected constructor(protected searchKeys: (keyof Entity)[]) {
    super();
  }

  /**
   * Queries for all entities that fit query criteria. Depending on whether a user is logged in and whether
   * the user has an admin role, returns public/users/admin entries only.
   * all of them are returned without checking for access rights.
   *
   * @param queryArgs - contain table filtering rules
   * @param user - user that retrieves entities
   * @returns data that fit criteria
   */
  search(
    queryArgs: SearchArgs,
    user?: User,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    if (user) {
      if (user.role === DefaultRoles.ADMIN) {
        return this.service.searchAsAdmin(queryArgs, this.searchKeys);
      }
      return this.service.searchAsUser(queryArgs, this.searchKeys, user);
    }
    return this.service.searchPublic(queryArgs, this.searchKeys);
  }

  /**
   * Queries for all entities that fit query criteria. It only returns the entities that are marked with
   * public read access.
   *
   * @param queryArgs - contain table filtering rules
   * @returns data that fit criteria
   */
  searchPublic(
    queryArgs: SearchArgs,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    return this.service.searchPublic(queryArgs, this.searchKeys);
  }

  /**
   * Queries for all entities that fit query criteria. It only returns the entities that the
   * user is the owner or the user is part of an access group that has read access to these items. This
   * endpoint does not return public items, though, since they do not explicitely belong to the user.
   *
   * @param queryArgs - contain table filtering rules
   * @param user - user that retrieves entities
   * @returns data that fit criteria
   */
  searchOfUser(
    queryArgs: SearchArgs,
    user: User,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    return this.service.searchOfUser(queryArgs, this.searchKeys, user);
  }

  /**
   * Queries for all entities that fit query criteria. This service function must be
   * used with caution and should only be used for resolvers that are marked as @AdminOnly
   *
   * @param queryArgs - contain table filtering rules
   * @returns data that fit criteria
   */
  searchAsAdmin(
    queryArgs: SearchArgs,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    return this.service.searchAsAdmin(queryArgs, this.searchKeys);
  }
}
