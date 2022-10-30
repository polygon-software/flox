import AccessControlledEntity from '../../access-control/entities/access-controlled.entity';
import User from '../../auth/entities/user.entity';
import AbstractCrudAccessControlResolver from '../crud-access-control/abstract-crud-access-control.resolver';
import SearchArgs from '../search/dto/args/search.args';
import SearchQueryOutputInterface from '../search/outputs/search-interface.output';
import { DEFAULT_ROLES } from '../../roles/config';

import AbstractSearchAccessControlService from './abstract-search-access-control.service';

import type { NestedKeyOf } from '../../../../types/NestedKeyOf';

export default abstract class AbstractSearchAccessControlResolver<
  Entity extends AccessControlledEntity,
  Service extends AbstractSearchAccessControlService<Entity>,
> extends AbstractCrudAccessControlResolver<Entity, Service> {
  protected constructor(protected searchKey: NestedKeyOf<Entity>) {
    super();
  }

  search(
    queryArgs: SearchArgs,
    user?: User,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    if (user) {
      if (user.role === DEFAULT_ROLES.ADMIN) {
        return this.service.searchAsAdmin(queryArgs, this.searchKey);
      }
      return this.service.searchAsUser(queryArgs, this.searchKey, user);
    }
    return this.service.searchPublic(queryArgs, this.searchKey);
  }

  searchPublic(
    queryArgs: SearchArgs,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    return this.service.searchPublic(queryArgs, this.searchKey);
  }

  searchOfUser(
    queryArgs: SearchArgs,
    user: User,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    return this.service.searchOfUser(queryArgs, this.searchKey, user);
  }

  searchAsAdmin(
    queryArgs: SearchArgs,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    return this.service.searchAsAdmin(queryArgs, this.searchKey);
  }
}
