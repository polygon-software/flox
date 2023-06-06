import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import BaseEntity from '../../../core/base-entity/entities/base-entity.entity';

import GetAllArgs from './dto/args/get-all.args';
import GetMultipleArgs from './dto/args/get-multiple.args';
import GetOneArgs from './dto/args/get-one.args';
import CreateInput from './dto/input/create.input';
import DeleteInput from './dto/input/delete.input';
import UpdateInput from './dto/input/update.input';
import { extractWhere, mixWhere } from './helpers/crud.helper';

export default abstract class AbstractCrudService<Entity extends BaseEntity> {
  abstract get repository(): Repository<Entity>;

  /**
   * Retrieves a single item from the database
   *
   * @param getOneArgs - contains uuid of item to be retrieved
   * @param options - additional type ORM find options that are applied to find query
   * @returns the one item that was received
   */
  getOne(
    getOneArgs: GetOneArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity> {
    return this.repository.findOneOrFail({
      ...options,
      where: mixWhere<Entity>(
        [
          {
            uuid: getOneArgs.uuid,
          },
        ] as FindOptionsWhere<Entity>[],
        extractWhere<Entity>(options),
      ),
    });
  }

  /**
   * Retrieves multiple items explicitely specified by their uuid
   *
   * @param getMultipleArgs - contains a list of uuids of the items to retrieve
   * @param options - additional type ORM find options that are applied to find query
   * @returns the list of found entities
   */
  getMultiple(
    getMultipleArgs: GetMultipleArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.repository.find({
      ...options,
      where: mixWhere<Entity>(
        [
          {
            uuid: In(getMultipleArgs.uuids),
          },
        ] as FindOptionsWhere<Entity>[],
        extractWhere<Entity>(options),
      ),
    });
  }

  /**
   * Retrieves all items from a database with applying pagination
   *
   * @param getAllArgs - contains pagination parameters (skip, take)
   * @param options - additional type ORM find options that are applied to find query
   * @returns page of entities
   */
  getAll(
    getAllArgs: GetAllArgs,
    options?: FindManyOptions<Entity>,
  ): Promise<Entity[]> {
    return this.repository.find({
      ...options,
      take: getAllArgs.take,
      skip: getAllArgs.skip,
    });
  }

  /**
   * Creates a new item based on the create input
   *
   * @param createInput - specifications of item, must be deep partial of entity
   * @returns the created entity
   */
  async create(createInput: CreateInput): Promise<Entity> {
    const entity = this.repository.create(createInput as DeepPartial<Entity>);
    await this.repository.save(entity);
    return entity;
  }

  /**
   * Updates an existing entity within the database according to the update input
   *
   * @param updateInput - specification of update, must be deep partial of entity
   * @param options - additional type ORM find options that are applied to find query
   * @returns the updated entity, freshly retrieved from the database
   */
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

  /**
   * Updates an existing entity within the database according to the update input by saving a given entity in the database.
   * If entity does not exist in the database then inserts, otherwise updates.
   *
   * @param updateInput - specification of update, must be deep partial of entity
   * @param options - additional type ORM find options that are applied to find query
   * @returns the updated entity, freshly retrieved from the database
   */
  async updateNestedEntity(
    updateInput: UpdateInput,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity> {
    const entity = this.repository.create(updateInput as DeepPartial<Entity>);
    await this.repository.save(entity);
    return this.repository.findOneOrFail({
      ...options,
      where: {
        uuid: updateInput.uuid,
      } as FindOptionsWhere<Entity>,
    });
  }

  /**
   * Removes an entity from the database
   *
   * @param deleteInput - contains the uuid of the item to remove
   * @returns the deleted entity
   */
  async delete(deleteInput: DeleteInput): Promise<Entity> {
    const entity = await this.repository.findOneOrFail({
      where: {
        uuid: deleteInput.uuid,
      } as FindOptionsWhere<Entity>,
    });
    const { uuid } = entity;
    let deletedEntity;
    if (deleteInput.softDelete) {
      deletedEntity = await this.repository.softRemove(entity);
    } else {
      deletedEntity = await this.repository.remove(entity);
    }
    deletedEntity.uuid = uuid;
    return deletedEntity;
  }
}
