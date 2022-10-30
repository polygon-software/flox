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

import AccessControlledEntity from '../../access-control/entities/access-controlled.entity';
import User from '../../auth/entities/user.entity';
import GetAllArgs from '../crud/dto/get-all.args';
import GetMultipleArgs from '../crud/dto/get-multiple.args';
import GetOneArgs from '../crud/dto/get-one.args';
import DeleteInput from '../crud/inputs/delete.input';
import UpdateInput from '../crud/inputs/update.input';

import CreateAccessControlledInput from './dto/inputs/create-access-controlled.input';

export default abstract class AbstractCrudAccessControlService<
  Entity extends AccessControlledEntity,
> {
  abstract get repository(): Repository<Entity>;

  get accessControlRelationOptions(): FindOneOptions<Entity> {
    return {
      relations: {
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
        readAccess: {
          users: true,
        },
      } as FindOptionsRelations<Entity>,
    };
  }

  get writeAccessControlRelationOptions(): FindOneOptions<Entity> {
    return {
      relations: {
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

  getOneAsUser(
    getOneArgs: GetOneArgs,
    user: User,
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
          {
            uuid: getOneArgs.uuid,
            loggedInReadAccess: true,
          },
          {
            uuid: getOneArgs.uuid,
            owner: {
              uuid: user.uuid,
            },
          },
          {
            uuid: getOneArgs.uuid,
            readAccess: {
              users: {
                uuid: user.uuid,
              },
            },
          },
        ] as FindOptionsWhere<Entity>[],
        this.extractWhere(options),
      ),
    });
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

  getAllPublic(
    getAll: GetAllArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.repository.find({
      ...options,
      where: this.mixWhere(
        [
          {
            publicReadAccess: true,
          },
        ] as FindOptionsWhere<Entity>[],
        this.extractWhere(options),
      ),
      take: getAll.take,
      skip: getAll.skip,
    });
  }

  getAllAsUser(
    getAll: GetAllArgs,
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.repository.find({
      ...options,
      where: this.mixWhere(
        [
          {
            publicReadAccess: true,
          },
          {
            loggedInReadAccess: true,
          },
          {
            owner: {
              uuid: user.uuid,
            },
          },
          {
            readAccess: {
              users: {
                uuid: user.uuid,
              },
            },
          },
        ] as FindOptionsWhere<Entity>[],
        this.extractWhere(options),
      ),
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
      where: this.mixWhere(
        [] as FindOptionsWhere<Entity>[],
        this.extractWhere(options),
      ),
      take: getAll.take,
      skip: getAll.skip,
    });
  }

  getAllOfUser(
    getAll: GetAllArgs,
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    const where = this.mixWhere(
      [
        {
          owner: {
            uuid: user.uuid,
          },
        },
        {
          readAccess: {
            users: {
              uuid: user.uuid,
            },
          },
        },
      ] as FindOptionsWhere<Entity>[],
      this.extractWhere(options),
    );
    console.log('where', JSON.stringify(where));
    console.log('options', options);
    return this.repository.find({
      ...options,
      where,
      take: getAll.take,
      skip: getAll.skip,
    });
  }

  getMultiplePublic(
    getMultiple: GetMultipleArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.repository.find({
      ...options,
      where: this.mixWhere(
        [
          {
            uuid: In(getMultiple.uuids),
            publicReadAccess: true,
          },
        ] as FindOptionsWhere<Entity>[],
        this.extractWhere(options),
      ),
    });
  }

  getMultipleAsUser(
    getMultiple: GetMultipleArgs,
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.repository.find({
      ...options,
      where: this.mixWhere(
        [
          {
            uuid: In(getMultiple.uuids),
            publicReadAccess: true,
          },
          {
            uuid: In(getMultiple.uuids),
            loggedInReadAccess: true,
          },
          {
            uuid: In(getMultiple.uuids),
            owner: {
              uuid: user.uuid,
            },
          },
          {
            uuid: In(getMultiple.uuids),
            readAccess: {
              users: {
                uuid: user.uuid,
              },
            },
          },
        ] as FindOptionsWhere<Entity>[],
        this.extractWhere(options),
      ),
    });
  }

  getMultipleOfUser(
    getMultiple: GetMultipleArgs,
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.repository.find({
      ...options,
      where: this.mixWhere(
        [
          {
            uuid: In(getMultiple.uuids),
            owner: {
              uuid: user.uuid,
            },
          },
          {
            uuid: In(getMultiple.uuids),
            readAccess: {
              users: {
                uuid: user.uuid,
              },
            },
          },
        ] as FindOptionsWhere<Entity>[],
        this.extractWhere(options),
      ),
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
    await this.repository.findOneOrFail({
      where: [
        {
          uuid: updateInput.uuid,
          owner: {
            uuid: user.uuid,
          },
        },
        {
          uuid: updateInput.uuid,
          writeAccess: {
            users: {
              uuid: user.uuid,
            },
          },
        },
      ] as FindOptionsWhere<Entity>[],
    });
    const updatedEntity = this.repository.create({
      ...(updateInput as DeepPartial<Entity>),
      ...entity,
    });
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
    const entity = await this.repository.findOneOrFail({
      where: [
        {
          uuid: deleteInput.uuid,
          owner: {
            uuid: user.uuid,
          },
        },
        {
          uuid: deleteInput.uuid,
          writeAccess: {
            users: {
              uuid: user.uuid,
            },
          },
        },
      ] as FindOptionsWhere<Entity>[],
    });
    const uuid = entity.uuid;
    const deletedEntity = await this.repository.remove(entity);
    deletedEntity.uuid = uuid;
    return deletedEntity;
  }
}
