import merge from 'lodash/merge';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FindOptionsSelect } from 'typeorm/find-options/FindOptionsSelect';

import AccessControlledEntity from '../../access-control/entities/access-controlled.entity';
import User from '../../auth/entities/user.entity';
import GetAllArgs from '../crud/dto/get-all.args';
import GetMultipleArgs from '../crud/dto/get-multiple.args';
import GetOneArgs from '../crud/dto/get-one.args';
import DeleteInput from '../crud/inputs/delete.input';
import UpdateInput from '../crud/inputs/update.input';
import {
  assertReadAccess,
  assertWriteAccess,
} from '../../access-control/helpers/access-control.helper';
import AccessControlService from '../../access-control/access-control.service';
import UserGroup from '../../access-control/entities/user-group.entity';

import CreateAccessControlledInput from './dto/inputs/create-access-controlled.input';
import ManipulateAccessGroupsInput from './dto/inputs/manipulate-access-groups.input';

export default abstract class AbstractCrudAccessControlService<
  Entity extends AccessControlledEntity,
> {
  abstract get repository(): Repository<Entity>;
  protected abstract readonly accessControlService: AccessControlService;

  /**
   * @returns typeorm find options that are required to determine read and write access on the retrieved entities
   */
  get accessControlRelationOptions(): FindOneOptions<Entity> {
    return {
      relations: {
        owner: true,
        readAccess: {
          users: true,
        },
        writeAccess: {
          users: true,
        },
      } as FindOptionsRelations<Entity>,
    };
  }

  /**
   * @returns typeorm find options that are required to determine read access on the retrieved entities
   */
  get readAccessControlRelationOptions(): FindOneOptions<Entity> {
    return {
      relations: {
        owner: true,
        readAccess: {
          users: true,
        },
      } as FindOptionsRelations<Entity>,
    };
  }

  /**
   * @returns typeorm find options that are required to determine write access on the retrieved entities
   */
  get writeAccessControlRelationOptions(): FindOneOptions<Entity> {
    return {
      relations: {
        owner: true,
        writeAccess: {
          users: true,
        },
      } as FindOptionsRelations<Entity>,
    };
  }

  /**
   * Extracts the 'where' part of a typeorm find query and returns it as an array of wheres
   * @param options - from where the 'where' should be extractet lol
   * @protected
   * @returns array of where queries
   */
  protected extractWhere(
    options?: FindOneOptions<Entity>,
  ): FindOptionsWhere<Entity>[] {
    const whereOptions: FindOptionsWhere<Entity>[] = [];
    if (options?.where) {
      if (Array.isArray(options.where)) {
        whereOptions.push(...options.where);
      } else {
        whereOptions.push(options.where);
      }
    }
    return whereOptions;
  }

  /**
   * Mixes two where arrays together. If you have two arrays containing where queries, this method combines each
   * where query with each other, like a zip. This is helpful when you have a list of where clauses provided by the
   * user / developer and a set of security where clauses that shall be applied to each of them - like ensuring only
   * items are retrieved for which the current user has appropriate read access.
   * @param securityWhere - The where clauses that ensure access rights - but could be any list of where clauses
   * @param customWhere - User provided where clauses
   * @example [{w1}, {w2}] x [{w3, w4}] -> [{w1 & w3}, {w1 & w4}, {w2 & w3}, {w2 & w4}]
   * @protected
   * @returns zip of all possible combinations of the two where clauses
   */
  protected mixWhere(
    securityWhere: FindOptionsWhere<Entity>[],
    customWhere: FindOptionsWhere<Entity>[],
  ): FindOptionsWhere<Entity>[] {
    if (securityWhere.length === 0) {
      return customWhere;
    }
    if (customWhere.length === 0) {
      return securityWhere;
    }
    return securityWhere
      .map((securityClause) => {
        return customWhere.map((customClause) => {
          return {
            ...securityClause,
            ...customClause,
          };
        });
      })
      .flat();
  }

  /**
   * Deeply merges two typeorm find queries
   * @param options1 - Any typeorm query option
   * @param options2 - Any other typeorm query option
   * @protected
   * @returns deep merge of the two options
   */
  protected mergeOptions(
    options1?: FindOneOptions<Entity>,
    options2?: FindOneOptions<Entity>,
  ): FindOneOptions<Entity> {
    if (!options1 && options2) {
      return options2;
    }
    if (!options2 && options1) {
      return options1;
    }
    if (options1 && options2) {
      return merge(options1, options2);
    }
    return {};
  }

  /**
   * Finds uuids of all entities that are marked for public read access
   * @param options - typeorm find options that are mixed applied, can be used for pagination and such
   * @protected
   * @returns list of uuids
   */
  protected async findUuidsForPublicReadAccess(
    options?: FindOneOptions<Entity>,
  ): Promise<string[]> {
    const entities = await this.repository.find({
      ...options,
      select: {
        uuid: true,
      } as FindOptionsSelect<Entity>,
      where: this.mixWhere(
        [
          {
            publicReadAccess: true,
          } as FindOptionsWhere<Entity>,
        ],
        this.extractWhere(options),
      ),
    });
    return entities.map((entity) => entity.uuid);
  }

  /**
   * Finds uuids of all entities that are marked for read access by any logged-in users
   * @param options - typeorm find options that are mixed applied, can be used for pagination and such
   * @protected
   * @returns list of uuids
   */
  protected async findUuidsForLoggedInReadAccess(
    options?: FindOneOptions<Entity>,
  ): Promise<string[]> {
    const entities = await this.repository.find({
      ...options,
      select: {
        uuid: true,
      } as FindOptionsSelect<Entity>,
      where: this.mixWhere(
        [
          {
            loggedInReadAccess: true,
          } as FindOptionsWhere<Entity>,
        ],
        this.extractWhere(options),
      ),
    });
    return entities.map((entity) => entity.uuid);
  }

  /**
   * Finds uuids of all entities for which the provided user is set as the entity owner
   * @param owner - the owner of the entities
   * @param options - typeorm find options that are mixed applied, can be used for pagination and such
   * @protected
   * @returns list of uuids
   */
  protected async findUuidsForOwner(
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<string[]> {
    const entities = await this.repository.find({
      ...options,
      select: {
        uuid: true,
      } as FindOptionsSelect<Entity>,
      where: this.mixWhere(
        [
          {
            owner: {
              uuid: user.uuid,
            },
          } as FindOptionsWhere<Entity>,
        ],
        this.extractWhere(options),
      ),
    });
    return entities.map((entity) => entity.uuid);
  }

  /**
   * Finds uuids of all entities for which the provided user is part of a user group that has read access to the item
   * @param user - the user that must be part of the read access user group
   * @param options - typeorm find options that are mixed applied
   * @protected
   * @returns list of uuids
   */
  protected async findUuidsWithReadAccess(
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<string[]> {
    const userGroupsOfUser =
      await this.accessControlService.getUserGroupsForUser(user.uuid, {
        take: 5000,
        skip: 0,
      } as GetAllArgs);
    const entities = await this.repository.find({
      ...options,
      select: {
        uuid: true,
      } as FindOptionsSelect<Entity>,
      where: this.mixWhere(
        [
          {
            readAccess: {
              uuid: In(userGroupsOfUser.map((group) => group.uuid)),
            },
          } as FindOptionsWhere<Entity>,
        ],
        this.extractWhere(options),
      ),
      take: undefined,
      skip: undefined,
    });
    return entities.map((entity) => entity.uuid);
  }

  /**
   * Finds uuids of all entities for which the provided user is part of a user group that has write access to the item
   * @param user - the user that must be part of the write access user group
   * @param options - typeorm find options that are mixed applied
   * @protected
   * @returns list of uuids
   */
  protected async findUuidsWithWriteAccess(
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<string[]> {
    const userGroupsOfUser =
      await this.accessControlService.getUserGroupsForUser(user.uuid, {
        take: 5000,
        skip: 0,
      } as GetAllArgs);
    const entities = await this.repository.find({
      ...options,
      select: {
        uuid: true,
      } as FindOptionsSelect<Entity>,
      where: this.mixWhere(
        [
          {
            writeAccess: {
              uuid: In(userGroupsOfUser.map((group) => group.uuid)),
            },
          } as FindOptionsWhere<Entity>,
        ],
        this.extractWhere(options),
      ),
      take: undefined,
      skip: undefined,
    });
    return entities.map((entity) => entity.uuid);
  }

  /**
   * Finds all user groups with read access to an entity
   * @param getOneArgs - contains uuid of entity
   * @returns list of user groups with read access to the entity
   */
  async getReadAccessGroups(getOneArgs: GetOneArgs): Promise<UserGroup[]> {
    const item = await this.repository.findOneOrFail({
      where: {
        uuid: getOneArgs.uuid,
      } as FindOptionsWhere<Entity>,
      relations: {
        readAccess: {
          users: true,
        },
      } as FindOptionsRelations<Entity>,
    });
    return item.readAccess;
  }

  /**
   * Finds all user groups with write access to an entity
   * @param getOneArgs - contains uuid of entity
   * @returns list of user groups with write access to the entity
   */
  async getWriteAccessGroups(getOneArgs: GetOneArgs): Promise<UserGroup[]> {
    const item = await this.repository.findOneOrFail({
      where: {
        uuid: getOneArgs.uuid,
      } as FindOptionsWhere<Entity>,
      relations: {
        writeAccess: {
          users: true,
        },
      } as FindOptionsRelations<Entity>,
    });
    return item.writeAccess;
  }

  /**
   * Retrieves a single item from the database, iff it is marked for public read access
   * @param getOneArgs - contains uuid of item to be retrieved
   * @param options - additional type ORM find options that are applied to find query
   * @returns the one item that was received
   */
  getOnePublic(
    getOneArgs: GetOneArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity> {
    return this.repository.findOneOrFail({
      ...options,
      where: this.mixWhere(
        [
          {
            uuid: getOneArgs.uuid,
            publicReadAccess: true,
          },
        ] as FindOptionsWhere<Entity>[],
        this.extractWhere(options),
      ),
    });
  }

  /**
   * Retrieves a single entity from the database, ensuring the provided user has access to it by either being owner or
   * allowed reader of the item. Alternatively, the item can be public, then the user has also access to it.
   * @param getOneArgs - contains uuid of item to be retrieved
   * @param user - the user that retrieves the entity
   * @param options - additional type ORM find options that are applied to find query
   * @returns the one item that was received
   */
  async getOneAsUser(
    getOneArgs: GetOneArgs,
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity> {
    const entity = await this.repository.findOneOrFail({
      where: {
        uuid: getOneArgs.uuid,
      } as FindOptionsWhere<Entity>,
      ...this.mergeOptions(options, this.readAccessControlRelationOptions),
    });
    assertReadAccess(entity, user);
    return entity;
  }

  /**
   * Retrieves a single entity from the database, ensuring the provided user has access to it by either being owner or
   * allowed writer of the item
   * @param getOneArgs - contains uuid of item to be retrieved
   * @param user - the user that retrieves the entity
   * @param options - additional type ORM find options that are applied to find query
   * @returns the one item that was received
   */
  async getOneAsUserToWrite(
    getOneArgs: GetOneArgs,
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity> {
    const entity = await this.repository.findOneOrFail({
      where: {
        uuid: getOneArgs.uuid,
      } as FindOptionsWhere<Entity>,
      ...this.mergeOptions(options, this.writeAccessControlRelationOptions),
    });
    assertWriteAccess(entity, user);
    return entity;
  }

  /**
   * Retrieves a single entity from the database, but ignores any access right settings. This service function must be
   * used with caution and should only be used for resolvers that are marked as @AdminOnly
   * @param getOneArgs - contains uuid of item to be retrieved
   * @param options - additional type ORM find options that are applied to find query
   * @returns the one item that was received
   */
  getOneAsAdmin(
    getOneArgs: GetOneArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity> {
    return this.repository.findOneOrFail({
      ...options,
      where: [
        {
          uuid: getOneArgs.uuid,
        },
      ] as FindOptionsWhere<Entity>[],
    });
  }

  /**
   * Retrieves multiple items explicitely specified by their uuid. It only returns the entities that are marked with
   * public read access.
   * @param getMultipleArgs - contains a list of uuids of the items to retrieve
   * @param options - additional type ORM find options that are applied to find query
   * @returns the list of found entities
   */
  async getMultiplePublic(
    getMultipleArgs: GetMultipleArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.repository.find({
      ...options,
      where: this.mixWhere(
        [
          {
            publicReadAccess: true,
            uuid: In(getMultipleArgs.uuids),
          } as FindOptionsWhere<Entity>,
        ],
        this.extractWhere(options),
      ),
    });
  }

  /**
   * Retrieves multiple items explicitely specified by their uuid. It only returns the entities that are public, the
   * user is the owner or the user is part of an access group that has read access to these items.
   * @param getMultipleArgs - contains a list of uuids of the items to retrieve
   * @param user - the user that retrieves the entity
   * @param options - additional type ORM find options that are applied to find query
   * @returns the list of found entities
   */
  async getMultipleAsUser(
    getMultipleArgs: GetMultipleArgs,
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    const [publicReadUuids, loggedInReadUuids, ownerUuids, readUuids] =
      await Promise.all([
        this.findUuidsForPublicReadAccess(options),
        this.findUuidsForLoggedInReadAccess(options),
        this.findUuidsForOwner(user, options),
        this.findUuidsWithReadAccess(user, options),
      ]);
    return this.repository.find({
      ...options,
      where: [
        {
          uuid: In(getMultipleArgs.uuids),
        },
        {
          uuid: In([
            ...publicReadUuids,
            ...loggedInReadUuids,
            ...ownerUuids,
            ...readUuids,
          ]),
        },
      ] as FindOptionsWhere<Entity>[],
    });
  }

  /**
   * Retrieves multiple items explicitely specified by their uuid. It only returns the entities that the
   * user is the owner or the user is part of an access group that has read access to these items. This
   * endpoint does not return public items, though, since they do not explicitely belong to the user.
   * @param getMultipleArgs - contains a list of uuids of the items to retrieve
   * @param user - the user that retrieves the entity
   * @param options - additional type ORM find options that are applied to find query
   * @returns the list of found entities
   */
  async getMultipleOfUser(
    getMultipleArgs: GetMultipleArgs,
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    const [ownerUuids, readUuids] = await Promise.all([
      this.findUuidsForOwner(user, options),
      this.findUuidsWithReadAccess(user, options),
    ]);
    return this.repository.find({
      ...options,
      where: [
        {
          uuid: In(getMultipleArgs.uuids),
        },
        {
          uuid: In([...ownerUuids, ...readUuids]),
        },
      ] as FindOptionsWhere<Entity>[],
    });
  }

  /**
   * Retrieves multiple items explicitely specified by their uuid. This service function must be
   * used with caution and should only be used for resolvers that are marked as @AdminOnly
   * @param getMultipleArgs - contains a list of uuids of the items to retrieve
   * @param options - additional type ORM find options that are applied to find query
   * @returns the list of found entities
   */
  getMultipleAsAdmin(
    getMultipleArgs: GetMultipleArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.repository.find({
      ...options,
      where: this.mixWhere(
        [
          {
            uuid: In(getMultipleArgs.uuids),
          },
        ] as FindOptionsWhere<Entity>[],
        this.extractWhere(options),
      ),
    });
  }

  /**
   * Retrieves all items from a database with applying pagination. It only returns the entities that are marked with
   * public read access.
   * @param getAllArgs - contains pagination parameters (skip, take)
   * @param options - additional type ORM find options that are applied to find query
   * @returns page of entities
   */
  async getAllPublic(
    getAllArgs: GetAllArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.repository.find({
      ...options,
      where: this.mixWhere(
        [
          {
            publicReadAccess: true,
          } as FindOptionsWhere<Entity>,
        ],
        this.extractWhere(options),
      ),
      take: getAllArgs.take,
      skip: getAllArgs.skip,
    });
  }

  /**
   * Retrieves all items from a database with applying pagination. It only returns the entities that are public, the
   * user is the owner or the user is part of an access group that has read access to these items.
   * @param getAllArgs - contains pagination parameters (skip, take)
   * @param user - the user that retrieves the entity
   * @param options - additional type ORM find options that are applied to find query
   * @returns page of entities
   */
  async getAllAsUser(
    getAllArgs: GetAllArgs,
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    const [publicReadUuids, loggedInReadUuids, ownerUuids, readUuids] =
      await Promise.all([
        this.findUuidsForPublicReadAccess(options),
        this.findUuidsForLoggedInReadAccess(options),
        this.findUuidsForOwner(user, options),
        this.findUuidsWithReadAccess(user, options),
      ]);
    return this.repository.find({
      ...options,
      where: {
        uuid: In([
          ...publicReadUuids,
          ...loggedInReadUuids,
          ...ownerUuids,
          ...readUuids,
        ]),
      } as FindOptionsWhere<Entity>,
      take: getAllArgs.take,
      skip: getAllArgs.skip,
    });
  }

  /**
   * Retrieves all items from a database with applying pagination. It only returns the entities that the
   * user is the owner or the user is part of an access group that has read access to these items. This
   * endpoint does not return public items, though, since they do not explicitely belong to the user.
   * @param getAllArgs - contains pagination parameters (skip, take)
   * @param user - the user that retrieves the entity
   * @param options - additional type ORM find options that are applied to find query
   * @returns page of entities
   */
  async getAllOfUser(
    getAllArgs: GetAllArgs,
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    const owner = await this.findUuidsForOwner(user, options);
    const access = await this.findUuidsWithReadAccess(user, options);
    return this.repository.find({
      ...options,
      where: {
        uuid: In([...owner, ...access]),
      } as FindOptionsWhere<Entity>,
      take: getAllArgs.take,
      skip: getAllArgs.skip,
    });
  }

  /**
   * Retrieves all items from a database with applying pagination. This service function must be
   * used with caution and should only be used for resolvers that are marked as @AdminOnly
   * @param getAllArgs - contains pagination parameters (skip, take)
   * @param options - additional type ORM find options that are applied to find query
   * @returns page of entities
   */
  getAllAsAdmin(
    getAllArgs: GetAllArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.repository.find({
      ...options,
      take: getAllArgs.take,
      skip: getAllArgs.skip,
    });
  }

  /**
   * Creates a new item based on the create input and sets the user as the items owner.
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
    const createEntity = this.repository.create({
      ...createInput,
      ...entity,
      readAccess: createInput.readAccess.map((uuid) => ({ uuid })),
      writeAccess: createInput.writeAccess.map((uuid) => ({ uuid })),
      owner: user,
    } as DeepPartial<Entity>);
    await this.repository.save(createEntity);
    return createEntity;
  }

  /**
   * Updates an existing entity within the database according to the update input with ensuring the
   * user has appropriate write access to the item.
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
    const storedEntity = await this.getOneAsUserToWrite(
      { uuid: updateInput.uuid },
      user,
    );
    const updatedEntity = {
      ...storedEntity,
      ...(updateInput as DeepPartial<Entity>),
      ...entity,
      readAccess: undefined,
      writeAccess: undefined,
    };
    await this.repository.update(
      updateInput.uuid,
      updatedEntity as QueryDeepPartialEntity<Entity>,
    );
    return this.repository.findOneOrFail({
      where: {
        uuid: updateInput.uuid,
      } as FindOptionsWhere<Entity>,
    });
  }

  /**
   * Removes an entity from the database with ensuring the user has appropriate write access to the item.
   * @param deleteInput - contains the uuid of the item to remove
   * @param user - the user that deletes the entity
   * @returns the deleted entity
   */
  async delete(deleteInput: DeleteInput, user: User): Promise<Entity> {
    const entity = await this.getOneAsUserToWrite(
      { uuid: deleteInput.uuid },
      user,
    );
    const uuid = entity.uuid;
    const deletedEntity = await this.repository.remove(entity);
    deletedEntity.uuid = uuid;
    return deletedEntity;
  }

  /**
   * Adds/Removes user groups from the read/write access groups of an entity.
   * @param manipulateAccessGroups - contains the adds/removes for the read/write groups.
   * @param user - user that tries to perform the manipulation, must have write access to the entity
   * @param sudo - perform action in sudo mode, means ignoring whether the user has appropriate rights to perform
   *               the action
   * @returns Updated entity
   */
  async manipulateAccessUserGroups(
    manipulateAccessGroups: ManipulateAccessGroupsInput,
    user?: User,
    sudo?: false,
  ): Promise<Entity> {
    const entity = await this.repository.findOneOrFail({
      where: {
        uuid: manipulateAccessGroups.uuid,
      } as FindOptionsWhere<Entity>,
      ...this.accessControlRelationOptions,
    });

    sudo || assertWriteAccess(entity, user);

    const readAccess = [
      ...new Set([
        ...entity.readAccess.map((group) => group.uuid),
        ...manipulateAccessGroups.addReadAccess,
      ]),
    ]
      .filter((uuid) => !manipulateAccessGroups.removeReadAccess.includes(uuid))
      .map((uuid) => ({ uuid }));

    const writeAccess = [
      ...new Set([
        ...entity.writeAccess.map((group) => group.uuid),
        ...manipulateAccessGroups.addWriteAccess,
      ]),
    ]
      .filter(
        (uuid) => !manipulateAccessGroups.removeWriteAccess.includes(uuid),
      )
      .map((uuid) => ({ uuid }));

    const updatedEntity = {
      ...entity,
      readAccess,
      writeAccess,
    } as Entity;
    await this.repository.save(updatedEntity);
    return this.getOneAsAdmin({ uuid: manipulateAccessGroups.uuid });
  }
}
