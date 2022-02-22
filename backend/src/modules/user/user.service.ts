import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PERMISSION, ROLE } from '../../ENUM/ENUM';
import { AddUserPermissionInput } from './dto/input/add-user-permission.input';
import { Args } from '@nestjs/graphql';
import { GetPreviewArgs } from '../preview/dto/get-preview.args';
import { fetchFromTable } from '../../helpers/database-helpers';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user on the database
   * @param {CreateUserInput} createUserInput - input values
   * @returns {User} - the database user
   */
  async create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.usersRepository.create({
      ...createUserInput,
      role: ROLE.USER,
    });
    return this.usersRepository.save(user);
  }

  /**
   * Returns all Players
   * @returns {Promise<User[]>} - all partner users
   */
  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: ROLE.USER },
    });
  }

  /**
   * Fetches a single user
   * @param {GetUserArgs} getUserArgs - search arguments, containing UUID
   * @returns {Promise<User>} - the user
   */
  getUser(getUserArgs: GetUserArgs): Promise<User> {
    return this.usersRepository.findOne(getUserArgs.uuid);
  }

  /**
   * Updates a user
   * @param {UpdateUserInput} updateUserInput - user update info
   * @returns {Promise<User>} - the updated user
   */
  async update(updateUserInput: UpdateUserInput): Promise<User> {
    const user = this.usersRepository.create(updateUserInput);
    await this.usersRepository.update(updateUserInput.uuid, user);
    return this.usersRepository.findOne(updateUserInput.uuid);
  }

  /**
   * Deletes a user
   * @param {DeleteUserInput} deleteUserInput - input, containing UUID
   * @returns {Promise<User>} - the deleted user
   */
  async remove(deleteUserInput: DeleteUserInput): Promise<User> {
    const user = await this.usersRepository.findOne(deleteUserInput.uuid);
    const uuid = user.uuid;
    const deletedUser = await this.usersRepository.remove(user);
    deletedUser.uuid = uuid;
    return deletedUser;
  }

  /**
   * Grants a user access to an instance (MR2000, MR3000 or project)
   * @param {AddUserPermissionInput} addUserPermissionInput - input, containing user uuid, resource name and type
   * @returns {Promise<User>} - the updated user
   */
  async addPermission(
    addUserPermissionInput: AddUserPermissionInput,
  ): Promise<User> {
    // Get user
    const user = await this.usersRepository.findOne(
      addUserPermissionInput.uuid,
    );

    if (!user) {
      throw new Error(`No user found for ${addUserPermissionInput.uuid}`);
    }

    let column;

    // Find corresponding permission column
    switch (addUserPermissionInput.type) {
      case PERMISSION.MR2000:
        column = 'mr2000instances';
        break;
      case PERMISSION.MR3000:
        column = 'mr3000instances';
        break;
      case PERMISSION.PROJECT:
        column = 'projects';
        break;
      default:
        throw new Error(
          `Invalid permission type ${addUserPermissionInput.type}`,
        );
    }

    // Either extend existing array or create new one
    const updatedColumn = user[column]
      ? [...user[column], addUserPermissionInput.resource]
      : [addUserPermissionInput.resource];

    await this.usersRepository.update(addUserPermissionInput.uuid, {
      [column]: updatedColumn,
    });

    return this.usersRepository.findOne(addUserPermissionInput.uuid);
  }

  /**
   * Returns a list of the user's projects
   * @param {GetUserArgs} getUserProjectsArgs - contains user's UUID
   * @returns {Promise<Project[]>} - the user's projects
   */
  async getUserProjects(getUserProjectsArgs: GetUserArgs) {
    const projects = [];

    // Get all MR3000 instances
    const mr3000instances = await fetchFromTable('MR3000', 'station');

    mr3000instances.forEach((instance) => {
      if (instance.comment && !projects.includes(instance.comment.trim())) {
        projects.push(instance.comment.trim());
      }
    });

    console.log('Projects:', projects);
    // return rows.toString();

    return [];
  }
}
