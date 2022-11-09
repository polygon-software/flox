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

  async getAllPublic(
    getAll: GetAllArgs,
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
      take: getAll.take,
      skip: getAll.skip,
    });
  }

  async getAllAsUser(
    getAll: GetAllArgs,
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
      take: getAll.take,
      skip: getAll.skip,
    });
  }

  getAllAsAdmin(
    getAll: GetAllArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.repository.find({
      ...options,
      take: getAll.take,
      skip: getAll.skip,
    });
  }

  async getAllOfUser(
    getAll: GetAllArgs,
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
      take: getAll.take,
      skip: getAll.skip,
    });
  }

  async getMultiplePublic(
    getMultiple: GetMultipleArgs,
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
    });
  }

  async getMultipleAsUser(
    getMultiple: GetMultipleArgs,
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
          uuid: In(getMultiple.uuids),
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

  async getMultipleOfUser(
    getMultiple: GetMultipleArgs,
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
          uuid: In(getMultiple.uuids),
        },
        {
          uuid: In([...ownerUuids, ...readUuids]),
        },
      ] as FindOptionsWhere<Entity>[],
    });
  }

  getMultipleAsAdmin(
    getMultiple: GetMultipleArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.repository.find({
      ...options,
      where: this.mixWhere(
        [
          {
            uuid: In(getMultiple.uuids),
          },
        ] as FindOptionsWhere<Entity>[],
        this.extractWhere(options),
      ),
    });
  }

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
    console.log('user', user);
    console.log('entity', entity);
    sudo || assertWriteAccess(entity, user);

    console.log('Has access');

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
    console.log(updatedEntity);
    await this.repository.save(updatedEntity);
    return this.getOneAsAdmin({ uuid: manipulateAccessGroups.uuid });
  }
}
