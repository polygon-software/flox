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

  getOne(getOneArgs: GetOneArgs): Promise<Entity> {
    return this.service.getOne(getOneArgs);
  }

  getMultiple(getMultipleArgs: GetMultipleArgs): Promise<Entity[]> {
    return this.service.getMultiple(getMultipleArgs);
  }

  getAll(getAllArgs: GetAllArgs): Promise<Entity[]> {
    return this.service.getAll(getAllArgs);
  }

  async create(createInput: CreateInput): Promise<Entity> {
    return this.service.create(createInput);
  }

  async update(updateInput: UpdateInput): Promise<Entity> {
    return this.service.update(updateInput);
  }

  async delete(deleteInput: DeleteInput): Promise<Entity> {
    return this.service.delete(deleteInput);
  }
}
