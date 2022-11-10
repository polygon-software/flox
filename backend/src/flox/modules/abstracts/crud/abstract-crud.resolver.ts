import { FindOneOptions } from 'typeorm';

import BaseEntity from '../../../core/base-entity/entities/base-entity.entity';

import GetAllArgs from './dto/get-all.args';
import GetMultipleArgs from './dto/get-multiple.args';
import GetOneArgs from './dto/get-one.args';
import CreateInput from './inputs/create.input';
import DeleteInput from './inputs/delete.input';
import UpdateInput from './inputs/update.input';
import AbstractCrudService from './abstract-crud.service';

export default abstract class AbstractCrudResolver<
  Entity extends BaseEntity,
  Service extends AbstractCrudService<Entity>,
> {
  abstract get service(): Service;

  /**
   * Retrieves a single item from the database
   * @param getOneArgs - contains uuid of item to be retrieved
   * @param options - additional type ORM find options that are applied to find query
   * @returns the one item that was received
   */
  getOne(
    getOneArgs: GetOneArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity> {
    return this.service.getOne(getOneArgs, options);
  }

  /**
   * Retrieves multiple items explicitely specified by their uuid
   * @param getMultipleArgs - contains a list of uuids of the items to retrieve
   * @param options - additional type ORM find options that are applied to find query
   * @returns the list of found entities
   */
  getMultiple(
    getMultipleArgs: GetMultipleArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.service.getMultiple(getMultipleArgs, options);
  }

  /**
   * Retrieves all items from a database with applying pagination
   * @param getAllArgs - contains pagination parameters (skip, take)
   * @param options - additional type ORM find options that are applied to find query
   * @returns page of entities
   */
  getAll(
    getAllArgs: GetAllArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.service.getAll(getAllArgs, options);
  }

  /**
   * Creates a new item based on the create input
   * @param createInput - specifications of item, must be deep partial of entity
   * @returns the created entity
   */
  async create(createInput: CreateInput): Promise<Entity> {
    return this.service.create(createInput);
  }

  /**
   * Updates an existing entity within the database according to the update input
   * @param updateInput - specification of update, must be deep partial of entity
   * @param options - additional type ORM find options that are applied to find query
   * @returns the updated entity, freshly retrieved from the database
   */
  async update(
    updateInput: UpdateInput,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity> {
    return this.service.update(updateInput, options);
  }

  /**
   * Removes an entity from the database
   * @param deleteInput - contains the uuid of the item to remove
   * @returns the deleted entity
   */
  async delete(deleteInput: DeleteInput): Promise<Entity> {
    return this.service.delete(deleteInput);
  }
}
