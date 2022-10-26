import { GetOneArgs } from '../crud/dto/get-one.args';
import { GetMultipleArgs } from '../crud/dto/get-multiple.args';
import { GetAllArgs } from '../crud/dto/get-all.args';
import { CreateInput } from '../crud/inputs/create.input';
import { UpdateInput } from '../crud/inputs/update.input';
import { DeleteInput } from '../crud/inputs/delete.input';
import { AccessControlledEntity } from '../../access-control/entities/access-controlled.entity';
import { AbstractCrudAccessControlService } from './abstract-crud-access-control.service';
import { User } from '../../auth/entities/user.entity';

export abstract class AbstractCrudAccessControlResolver<
  Entity extends AccessControlledEntity,
  Service extends AbstractCrudAccessControlService<Entity>,
> {
  abstract get service(): Service;

  getOne(getOneArgs: GetOneArgs, user?: User): Promise<Entity> {
    if (user) {
      return this.service.getOneForUser(getOneArgs, user);
    }
    return this.service.getOnePublic(getOneArgs);
  }

  getMultiple(getMultiple: GetMultipleArgs, user?: User): Promise<Entity[]> {
    if (user) {
      return this.service.getMultipleForUser(getMultiple, user);
    }
    return this.service.getMultiplePublic(getMultiple);
  }

  getMultipleOfMine(
    getMultiple: GetMultipleArgs,
    user: User,
  ): Promise<Entity[]> {
    return this.service.getMultipleForUser(getMultiple, user);
  }

  getMultiplePublic(getMultiple: GetMultipleArgs): Promise<Entity[]> {
    return this.service.getMultiplePublic(getMultiple);
  }

  getAll(getAll: GetAllArgs, user?: User): Promise<Entity[]> {
    if (user) {
      return this.service.getAllForUser(getAll, user);
    }
    return this.service.getAllPublic(getAll);
  }

  getAllOfMine(getAll: GetAllArgs, user: User): Promise<Entity[]> {
    return this.service.getAllForUser(getAll, user);
  }

  getAllPublic(getAll: GetAllArgs): Promise<Entity[]> {
    return this.service.getAllPublic(getAll);
  }

  async create(createInput: CreateInput, user: User): Promise<Entity> {
    return this.service.create(createInput, user);
  }

  async update(updateInput: UpdateInput, user: User): Promise<Entity> {
    return this.service.update(updateInput, user);
  }

  async delete(deleteInput: DeleteInput, user: User): Promise<Entity> {
    return this.service.delete(deleteInput, user);
  }
}
