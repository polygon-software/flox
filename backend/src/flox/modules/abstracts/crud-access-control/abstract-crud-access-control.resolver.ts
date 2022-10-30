import { DeepPartial, FindOneOptions } from 'typeorm';

import AccessControlledEntity from '../../access-control/entities/access-controlled.entity';
import User from '../../auth/entities/user.entity';
import GetAllArgs from '../crud/dto/get-all.args';
import GetMultipleArgs from '../crud/dto/get-multiple.args';
import GetOneArgs from '../crud/dto/get-one.args';
import DeleteInput from '../crud/inputs/delete.input';
import UpdateInput from '../crud/inputs/update.input';
import { DEFAULT_ROLES } from '../../roles/config';

import CreateAccessControlledInput from './dto/inputs/create-access-controlled.input';
import AbstractCrudAccessControlService from './abstract-crud-access-control.service';

export default abstract class AbstractCrudAccessControlResolver<
  Entity extends AccessControlledEntity,
  Service extends AbstractCrudAccessControlService<Entity>,
> {
  abstract get service(): Service;

  getOne(
    getOneArgs: GetOneArgs,
    user?: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity> {
    if (user) {
      if (user.role === DEFAULT_ROLES.ADMIN) {
        return this.service.getOneAsAdmin(getOneArgs, options);
      } else {
        return this.service.getOneAsUser(getOneArgs, user, options);
      }
    }
    return this.service.getOnePublic(getOneArgs, options);
  }

  getOneAsAdmin(
    getOneArgs: GetOneArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity> {
    return this.service.getOneAsAdmin(getOneArgs, options);
  }

  getMultiple(
    getMultiple: GetMultipleArgs,
    user?: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    if (user) {
      if (user.role === DEFAULT_ROLES.ADMIN) {
        return this.service.getMultipleAsAdmin(getMultiple, options);
      }
      return this.service.getMultipleAsUser(getMultiple, user, options);
    }
    return this.service.getMultiplePublic(getMultiple, options);
  }

  getMultipleOfMine(
    getMultiple: GetMultipleArgs,
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.service.getMultipleOfUser(getMultiple, user, options);
  }

  getMultiplePublic(
    getMultiple: GetMultipleArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.service.getMultiplePublic(getMultiple, options);
  }

  getMultipleAsAdmin(
    getMultiple: GetMultipleArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.service.getMultipleAsAdmin(getMultiple, options);
  }

  getAll(
    getAll: GetAllArgs,
    user?: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    if (user) {
      if (user.role === DEFAULT_ROLES.ADMIN) {
        return this.service.getAllAsAdmin(getAll, options);
      }
      return this.service.getAllAsUser(getAll, user, options);
    }
    return this.service.getAllPublic(getAll, options);
  }

  getAllOfMine(
    getAll: GetAllArgs,
    user: User,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.service.getAllOfUser(getAll, user, options);
  }

  getAllPublic(
    getAll: GetAllArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.service.getAllPublic(getAll, options);
  }

  getAllAsAdmin(
    getAll: GetAllArgs,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity[]> {
    return this.service.getAllAsAdmin(getAll, options);
  }

  async create(
    createInput: CreateAccessControlledInput,
    user: User,
    entity?: DeepPartial<Entity>,
  ): Promise<Entity> {
    return this.service.create(createInput, user, entity);
  }

  async update(
    updateInput: UpdateInput,
    user: User,
    entity?: DeepPartial<Entity>,
  ): Promise<Entity> {
    return this.service.update(updateInput, user, entity);
  }

  async delete(deleteInput: DeleteInput, user: User): Promise<Entity> {
    return this.service.delete(deleteInput, user);
  }
}
