import { DeepPartial, FindOneOptions } from 'typeorm';

import AccessControlledEntity from '../../access-control/entities/access-controlled.entity';
import User from '../../auth/entities/user.entity';
import GetAllArgs from '../crud/dto/args/get-all.args';
import GetMultipleArgs from '../crud/dto/args/get-multiple.args';
import GetOneArgs from '../crud/dto/args/get-one.args';
import DeleteInput from '../crud/dto/input/delete.input';
import UpdateInput from '../crud/dto/input/update.input';
import { DefaultRoles } from '../../roles/config';
import UserGroup from '../../access-control/entities/user-group.entity';

import CreateAccessControlledInput from './dto/input/create-access-controlled.input';
import AbstractCrudAccessControlService from './abstract-crud-access-control.service';
import ManipulateAccessGroupsInput from './dto/input/manipulate-access-groups.input';

export default abstract class AbstractCrudAccessControlResolver<
  Entity extends AccessControlledEntity,
  Service extends AbstractCrudAccessControlService<Entity>,
> {
  abstract get service(): Service;

  /**
   * Finds all user groups with read access to an entity
   *
   * @param getOneArgs - contains uuid of entity
   * @returns list of user groups with read access to the entity
   */
  async getReadAccessUserGroups(getOneArgs: GetOneArgs): Promise<UserGroup[]> {
    return this.service.getReadAccessGroups(getOneArgs);
  }

  /**
   * Finds all user groups with write access to an entity
   *
   * @param getOneArgs - contains uuid of entity
   * @returns list of user groups with write access to the entity
   */
  async getWriteAccessUserGroups(getOneArgs: GetOneArgs): Promise<UserGroup[]> {
    return this.service.getWriteAccessGroups(getOneArgs);
  }

  /**
   * Retrieves a single item from the database. Depending on whether a user is logged in and whether
   * the user has an admin role, returns public/users/admin entry only.
   *
   * @param getOneArgs - contains uuid of item to be retrieved
   * @param user - the user that retrieves the entity
   * @param options - additional type ORM find options that are applied to find query
   * @returns the one item that was received
   */
  getOne(
    getOneArgs: GetOneArgs,
    user?: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity> {
    if (user) {
      if (user.role === DefaultRoles.ADMIN) {
        return this.service.getOneAsAdmin(getOneArgs, options);
      }
      return this.service.getOneAsUser(getOneArgs, user, options);
    }
    return this.service.getOnePublic(getOneArgs, options);
  }

  /**
   * Retrieves a single entity from the database, but ignores any access right settings. This service function must be
   * used with caution and should only be used for resolvers that are marked as @AdminOnly
   *
   * @param getOneArgs - contains uuid of item to be retrieved
   * @param options - additional type ORM find options that are applied to find query
   * @returns the one item that was received
   */
  getOneAsAdmin(
    getOneArgs: GetOneArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity> {
    return this.service.getOneAsAdmin(getOneArgs, options);
  }

  /**
   * Retrieves multiple items explicitely specified by their uuid. Depending on whether a user is logged in and whether
   * the user has an admin role, returns public/users/admin entities only.
   *
   * @param getMultipleArgs - contains a list of uuids of the items to retrieve
   * @param user - the user that retrieves the entity
   * @param options - additional type ORM find options that are applied to find query
   * @returns the list of found entities
   */
  getMultiple(
    getMultipleArgs: GetMultipleArgs,
    user?: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    if (user) {
      if (user.role === DefaultRoles.ADMIN) {
        return this.service.getMultipleAsAdmin(getMultipleArgs, options);
      }
      return this.service.getMultipleAsUser(getMultipleArgs, user, options);
    }
    return this.service.getMultiplePublic(getMultipleArgs, options);
  }

  /**
   * Retrieves multiple items explicitely specified by their uuid. It only returns the entities that the
   * user is the owner or the user is part of an access group that has read access to these items. This
   * endpoint does not return public items, though, since they do not explicitely belong to the user.
   *
   * @param getMultipleArgs - contains a list of uuids of the items to retrieve
   * @param user - the user that retrieves the entity
   * @param options - additional type ORM find options that are applied to find query
   * @returns the list of found entities
   */
  getMultipleOfMine(
    getMultipleArgs: GetMultipleArgs,
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.service.getMultipleOfUser(getMultipleArgs, user, options);
  }

  /**
   * Retrieves multiple items explicitely specified by their uuid. It only returns the entities that are marked with
   * public read access.
   *
   * @param getMultipleArgs - contains a list of uuids of the items to retrieve
   * @param options - additional type ORM find options that are applied to find query
   * @returns the list of found entities
   */
  getMultiplePublic(
    getMultipleArgs: GetMultipleArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.service.getMultiplePublic(getMultipleArgs, options);
  }

  /**
   * Retrieves multiple items explicitly specified by their uuid. This service function must be
   * used with caution and should only be used for resolvers that are marked as @AdminOnly
   *
   * @param getMultipleArgs - contains a list of uuids of the items to retrieve
   * @param options - additional type ORM find options that are applied to find query
   * @returns the list of found entities
   */
  getMultipleAsAdmin(
    getMultipleArgs: GetMultipleArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.service.getMultipleAsAdmin(getMultipleArgs, options);
  }

  /**
   * Retrieves all items from a database with applying pagination. Depending on whether a user is logged in and whether
   * the user has an admin role, returns public/users/admin entities only.
   *
   * @param getAllArgs - contains pagination parameters (skip, take)
   * @param user - the user that retrieves the entity
   * @param options - additional type ORM find options that are applied to find query
   * @returns page of entities
   */
  getAll(
    getAllArgs: GetAllArgs,
    user?: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    if (user) {
      if (user.role === DefaultRoles.ADMIN) {
        return this.service.getAllAsAdmin(getAllArgs, options);
      }
      return this.service.getAllAsUser(getAllArgs, user, options);
    }
    return this.service.getAllPublic(getAllArgs, options);
  }

  /**
   * Retrieves all items from a database with applying pagination. It only returns the entities that the
   * user is the owner or the user is part of an access group that has read access to these items. This
   * endpoint does not return public items, though, since they do not explicitely belong to the user.
   *
   * @param getAllArgs - contains pagination parameters (skip, take)
   * @param user - the user that retrieves the entity
   * @param options - additional type ORM find options that are applied to find query
   * @returns page of entities
   */
  getAllOfMine(
    getAllArgs: GetAllArgs,
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.service.getAllOfUser(getAllArgs, user, options);
  }

  /**
   * Retrieves all items from a database with applying pagination. It only returns the entities that are marked with
   * public read access.
   *
   * @param getAllArgs - contains pagination parameters (skip, take)
   * @param options - additional type ORM find options that are applied to find query
   * @returns page of entities
   */
  getAllPublic(
    getAllArgs: GetAllArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.service.getAllPublic(getAllArgs, options);
  }

  /**
   * Retrieves all items from a database with applying pagination. This service function must be
   * used with caution and should only be used for resolvers that are marked as @AdminOnly
   *
   * @param getAllArgs - contains pagination parameters (skip, take)
   * @param options - additional type ORM find options that are applied to find query
   * @returns page of entities
   */
  getAllAsAdmin(
    getAllArgs: GetAllArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.service.getAllAsAdmin(getAllArgs, options);
  }

  /**
   * Creates a new item based on the create input and sets the user as the items owner.
   *
   * @param createInput - specifications of item, must be deep partial of entity
   * @param user - the user that creates the entity
   * @param entity - additional information about the entity that is not provided by the create input
   * @returns the created entity
   */
  async create(
    createInput: CreateAccessControlledInput,
    user: User,
    entity?: DeepPartial<Entity>,
  ): Promise<Entity> {
    return this.service.create(createInput, user, entity);
  }

  /**
   * Updates an existing entity within the database according to the update input with ensuring the
   * user has appropriate write access to the item.
   *
   * @param updateInput - specification of update, must be deep partial of entity
   * @param user - the user that updates the entity
   * @param entity - additional information about the entity that is not provided by the create input
   * @returns the updated entity, freshly retrieved from the database
   */
  async update(
    updateInput: UpdateInput,
    user: User,
    entity?: DeepPartial<Entity>,
  ): Promise<Entity> {
    return this.service.update(updateInput, user, entity);
  }

  /**
   * Removes an entity from the database with ensuring the user has appropriate write access to the item.
   *
   * @param deleteInput - contains the uuid of the item to remove
   * @param user - the user that deletes the entity
   * @returns the deleted entity
   */
  async delete(deleteInput: DeleteInput, user: User): Promise<Entity> {
    return this.service.delete(deleteInput, user);
  }

  /**
   * Adds/Removes user groups from the read/write access groups of an entity.
   *
   * @param manipulateAccessGroups - contains the adds/removes for the read/write groups.
   * @param user - user that tries to perform the manipulation, must have write access to the entity
   * @returns Updated entity
   */
  async manipulateAccessUserGroupsAsUser(
    manipulateAccessGroups: ManipulateAccessGroupsInput,
    user?: User,
  ): Promise<Entity> {
    return this.service.manipulateAccessUserGroupsAsUser(
      manipulateAccessGroups,
      user,
    );
  }
}
