import { AccessControlledEntity } from '../../access-control/entities/access-controlled.entity';
import { User } from '../../auth/entities/user.entity';
import { AbstractCrudAccessControlResolver } from '../crud-access-control/abstract-crud-access-control.resolver';
import { SearchArgs } from '../search/dto/args/search.args';
import SearchQueryOutputInterface from '../search/outputs/search-interface.output';

import { AbstractSearchAccessControlService } from './abstract-search-access-control.service';

export abstract class AbstractSearchAccessControlResolver<
  Entity extends AccessControlledEntity,
  Service extends AbstractSearchAccessControlService<Entity>,
> extends AbstractCrudAccessControlResolver<Entity, Service> {
  protected constructor(private searchKey: keyof Entity) {
    super();
  }

  search(
    queryArgs: SearchArgs,
    user?: User,
  ): Promise<SearchQueryOutputInterface<Entity>> {
    if (user) {
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
