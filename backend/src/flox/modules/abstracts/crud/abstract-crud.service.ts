import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import BaseEntity from '../../../core/base-entity/entities/base-entity.entity';

import GetAllArgs from './dto/get-all.args';
import GetMultipleArgs from './dto/get-multiple.args';
import GetOneArgs from './dto/get-one.args';
import CreateInput from './inputs/create.input';
import DeleteInput from './inputs/delete.input';
import UpdateInput from './inputs/update.input';

export default abstract class AbstractCrudService<Entity extends BaseEntity> {
  abstract get repository(): Repository<Entity>;

  getOne(
    getOneArgs: GetOneArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity> {
    return this.repository.findOneOrFail({
      ...options,
      where: {
        uuid: getOneArgs.uuid,
      } as FindOptionsWhere<Entity>,
    });
  }

  getAll(
    getAll: GetAllArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.repository.find({
      ...options,
      take: getAll.take,
      skip: getAll.skip,
    });
  }

  getMultiple(
    getMultiple: GetMultipleArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.repository.findBy({
      ...options,
      uuid: In(getMultiple.uuids),
    } as FindOptionsWhere<Entity>);
  }

  async create(createInput: CreateInput): Promise<Entity> {
    const entity = this.repository.create(createInput as DeepPartial<Entity>);
    await this.repository.save(entity);
    return entity;
  }

  async update(
    updateInput: UpdateInput,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity> {
    const entity = this.repository.create(updateInput as DeepPartial<Entity>);
    await this.repository.update(
      updateInput.uuid,
      entity as QueryDeepPartialEntity<Entity>,
    );
    return this.repository.findOneOrFail({
      ...options,
      where: {
        uuid: updateInput.uuid,
      } as FindOptionsWhere<Entity>,
    });
  }

  async delete(
    deleteInput: DeleteInput,
  ): Promise<Entity> {
    const entity = await this.repository.findOneOrFail({
      where: {
        uuid: deleteInput.uuid,
      } as FindOptionsWhere<Entity>,
    });
    const uuid = entity.uuid;
    const deletedEntity = await this.repository.remove(entity);
    deletedEntity.uuid = uuid;
    return deletedEntity;
  }
}
