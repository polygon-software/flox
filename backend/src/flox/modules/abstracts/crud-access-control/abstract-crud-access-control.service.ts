import { DeepPartial, FindOptionsWhere, In, Repository } from 'typeorm';
import { GetOneArgs } from '../crud/dto/get-one.args';
import { GetAllArgs } from '../crud/dto/get-all.args';
import { DeleteInput } from '../crud/inputs/delete.input';
import { UpdateInput } from '../crud/inputs/update.input';
import { GetMultipleArgs } from '../crud/dto/get-multiple.args';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { User } from '../../auth/entities/user.entity';
import { AccessControlledEntity } from '../../access-control/entities/access-controlled.entity';
import { CreateInput } from "./dto/inputs/create.input";

export abstract class AbstractCrudAccessControlService<
  Entity extends AccessControlledEntity,
> {
  abstract get repository(): Repository<Entity>;

  getOnePublic(getOneArgs: GetOneArgs): Promise<Entity> {
    return this.repository.findOneOrFail({
      where: [
        {
          uuid: getOneArgs.uuid,
          publicReadAccess: true,
        },
      ] as FindOptionsWhere<Entity>[],
    });
  }

  getOneForUser(getOneArgs: GetOneArgs, user: User): Promise<Entity> {
    return this.repository.findOneOrFail({
      where: [
        {
          uuid: getOneArgs.uuid,
          publicReadAccess: true,
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
    });
  }

  getOneAsAdmin(getOneArgs: GetOneArgs): Promise<Entity> {
    return this.repository.findOneOrFail({
      where: [
        {
          uuid: getOneArgs.uuid,
        },
      ] as FindOptionsWhere<Entity>[],
    });
  }

  getAllPublic(getAll: GetAllArgs): Promise<Entity[]> {
    return this.repository.find({
      where: [
        {
          publicReadAccess: true,
        },
      ] as FindOptionsWhere<Entity>[],
      take: getAll.take,
      skip: getAll.skip,
    });
  }

  getAllForUser(getAll: GetAllArgs, user: User): Promise<Entity[]> {
    return this.repository.find({
      where: [
        {
          publicReadAccess: true,
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
      take: getAll.take,
      skip: getAll.skip,
    });
  }

  getMultiplePublic(getMultiple: GetMultipleArgs): Promise<Entity[]> {
    return this.repository.find({
      where: [
        {
          uuid: In(getMultiple.uuids),
          publicReadAccess: true,
        },
      ] as FindOptionsWhere<Entity>[],
    });
  }

  getMultipleForUser(
    getMultiple: GetMultipleArgs,
    user: User,
  ): Promise<Entity[]> {
    return this.repository.find({
      where: [
        {
          uuid: In(getMultiple.uuids),
          publicReadAccess: true,
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
    });
  }

  getMultipleAsAdmin(getMultiple: GetMultipleArgs): Promise<Entity[]> {
    return this.repository.find({
      where: [
        {
          uuid: In(getMultiple.uuids),
        },
      ] as FindOptionsWhere<Entity>[],
    });
  }

  async create(createInput: CreateInput, user: User): Promise<Entity> {
    const entity = this.repository.create({
      ...createInput,
      readAccess: createInput.readAccess.map((uuid) => ({ uuid })),
      writeAccess: createInput.writeAccess.map((uuid) => ({ uuid })),
      owner: user,
    } as DeepPartial<Entity>);
    await this.repository.save(entity);
    return entity;
  }

  async update(updateInput: UpdateInput, user: User): Promise<Entity> {
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
    const updatedEntity = this.repository.create(
      updateInput as DeepPartial<Entity>,
    );
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
