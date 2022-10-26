import { BaseEntity } from '../../../core/base-entity/entities/base-entity.entity';
import { GetOneArgs } from './dto/get-one.args';
import { GetAllArgs } from './dto/get-all.args';
import { CreateInput } from './inputs/create.input';
import { UpdateInput } from './inputs/update.input';
import { DeleteInput } from './inputs/delete.input';
import { AbstractCrudService } from './abstract-crud.service';
import { GetMultipleArgs } from './dto/get-multiple.args';

export abstract class AbstractCrudResolver<
  Entity extends BaseEntity,
  Service extends AbstractCrudService<Entity>,
> {
  abstract get service(): Service;

  getOne(getOneArgs: GetOneArgs): Promise<Entity> {
    return this.service.getOne(getOneArgs);
  }

  getMultiple(getMultiple: GetMultipleArgs): Promise<Entity[]> {
    return this.service.getMultiple(getMultiple);
  }

  getAll(getAll: GetAllArgs): Promise<Entity[]> {
    return this.service.getAll(getAll);
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
