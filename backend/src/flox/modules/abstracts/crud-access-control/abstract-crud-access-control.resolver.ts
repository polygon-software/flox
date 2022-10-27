import { GetOneArgs } from '../crud/dto/get-one.args';
import { GetMultipleArgs } from '../crud/dto/get-multiple.args';
import { GetAllArgs } from '../crud/dto/get-all.args';
import { UpdateInput } from '../crud/inputs/update.input';
import { DeleteInput } from '../crud/inputs/delete.input';
import { AccessControlledEntity } from '../../access-control/entities/access-controlled.entity';
import { AbstractCrudAccessControlService } from './abstract-crud-access-control.service';
import { User } from '../../auth/entities/user.entity';
import { CreateInput } from './dto/inputs/create.input';

export abstract class AbstractCrudAccessControlResolver<
  Entity extends AccessControlledEntity,
  Service extends AbstractCrudAccessControlService<Entity>,
> {
  abstract get service(): Service;

  getOne(getOneArgs: GetOneArgs, user?: User): Promise<Entity> {
    if (user) {
      return this.service.getOneAsUser(getOneArgs, user);
    }
    return this.service.getOnePublic(getOneArgs);
  }

  getOneAsAdmin(getOneArgs: GetOneArgs): Promise<Entity> {
    return this.service.getOneAsAdmin(getOneArgs);
  }

  getMultiple(getMultiple: GetMultipleArgs, user?: User): Promise<Entity[]> {
    if (user) {
      return this.service.getMultipleAsUser(getMultiple, user);
    }
    return this.service.getMultiplePublic(getMultiple);
  }

  getMultipleOfMine(
    getMultiple: GetMultipleArgs,
    user: User,
  ): Promise<Entity[]> {
    return this.service.getMultipleOfUser(getMultiple, user);
  }

  getMultiplePublic(getMultiple: GetMultipleArgs): Promise<Entity[]> {
    return this.service.getMultiplePublic(getMultiple);
  }

  getMultipleAsAdmin(getMultiple: GetMultipleArgs): Promise<Entity[]> {
    return this.service.getMultipleAsAdmin(getMultiple);
  }

  getAll(getAll: GetAllArgs, user?: User): Promise<Entity[]> {
    if (user) {
      return this.service.getAllAsUser(getAll, user);
    }
    return this.service.getAllPublic(getAll);
  }

  getAllOfMine(getAll: GetAllArgs, user: User): Promise<Entity[]> {
    return this.service.getAllOfUser(getAll, user);
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
