import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PERMISSION, ROLE } from '../../ENUM/ENUM';
import { AddUserPermissionInput } from './dto/input/add-user-permission.input';
import { fetchFromTable } from '../../helpers/database-helpers';
import { MR2000 } from '../../types/MR2000';
import { MR3000 } from '../../types/MR3000';
import { RegisterUserInput } from './dto/input/register-user.input';
import { GetProjectDevicesArgs } from './dto/args/get-project-devices.args';
import {
  mr2000fromDatabaseEntry,
  mr3000fromDatabaseEntry,
} from '../../helpers/device-helpers';
import { GetUserDevicesArgs } from './dto/args/get-user-devices.args';
import { GetUserProjectsArgs } from './dto/args/get-user-projects.args';
import { getProjectsForInstances } from '../../helpers/project-helpers';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, Observable } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly axios: HttpService,
  ) {}

  async getDeviceData(
    file: string,
    start: Date,
    end: Date,
    resolution: number,
  ) {
    const url = `http://localhost:5000/rrt?file=${file}&start=${start.getTime()}&end=${end.getTime()}&step=${resolution}`;
    const response: Observable<unknown> = this.axios
      .get(url)
      .pipe(map((response) => response.data));
    const data = await firstValueFrom(response);
    return JSON.stringify(data);
  }

  /**
   * Register a new user. Returns null if user email is not in DB.
   * @param {RegisterUserInput} registerUserInput - input values
   * @returns {User} - the database user
   */
  async register(registerUserInput: RegisterUserInput): Promise<User> {
    const update = this.usersRepository.create(registerUserInput);
    const user = await this.usersRepository.findOne({
      where: { email: update.email },
    });
    if (user) {
      await this.usersRepository.update(user.uuid, update);
      return this.usersRepository.findOne(user.uuid);
    }
    return null;
  }

  /**
   * Check if user email is in DB.
   * @param {string} email - user email.
   * @returns {boolean} - if the email is in the DB.
   */
  async existsUserWithEmail(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    return !!user;
  }

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
   * @param {string} cognitoUuid - cognito UUID of the requester
   * @returns {Promise<User>} - the user
   */
  fetchUserByCognitoUuid(cognitoUuid: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { cognitoUuid: cognitoUuid },
    });
  }

  /**
   * Fetches a single user
   * @param {GetUserArgs} getUserArgs - search arguments, containing UUID or Cognito UUID
   * @returns {Promise<User>} - the user
   */
  getUser(getUserArgs: GetUserArgs): Promise<User> {
    return this.usersRepository.findOne(
      getUserArgs.uuid
        ? {
            uuid: getUserArgs.uuid,
          }
        : {
            cognitoUuid: getUserArgs.cognitoUuid,
          },
    );
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
   * @param {GetUserProjectsArgs} getUserProjectsArgs - contains user's UUID
   * @returns {Promise<Project[]>} - the user's projects
   */
  async getUserProjects(getUserProjectsArgs: GetUserProjectsArgs) {
    // Get user
    const user = await this.usersRepository.findOne(getUserProjectsArgs.uuid);

    if (!user) {
      throw new Error(`No user found for ${getUserProjectsArgs.uuid}`);
    }

    // Get all MR2000 & MR3000 instances
    const mr2000instances = await fetchFromTable('MR2000', 'station');
    const mr3000instances = await fetchFromTable('MR3000', 'station');

    // Build list of projects from instances
    const projects = getProjectsForInstances(mr2000instances, mr3000instances);

    // Filter by projects that the user has access to
    return projects.filter((project) => user.projects.includes(project.name));
  }

  /**
   * Returns a list of the user's MR2000 & MR3000 devices
   * @param {GetUserDevicesArgs} getUserDevicesArgs - contains user's UUID
   * @returns {Promise<MR2000|MR3000[]>} - the user's devices
   */
  async getUserDevices(getUserDevicesArgs: GetUserDevicesArgs) {
    // Get user
    const user = await this.usersRepository.findOne(getUserDevicesArgs.uuid);

    if (!user) {
      throw new Error(`No user found for ${getUserDevicesArgs.uuid}`);
    }

    const filterQuery = getUserDevicesArgs.unassigned
      ? "WHERE (comment IS null OR comment='')"
      : null;

    // Get all MR2000 & MR3000 instances
    const mr2000instances = await fetchFromTable(
      'MR2000',
      'station',
      filterQuery,
    );
    const mr3000instances = await fetchFromTable(
      'MR3000',
      'station',
      filterQuery,
    );

    const devices = [];

    // Add all allowed MR2000 instances
    mr2000instances.forEach((instance) => {
      if (user.mr2000instances.includes(instance.cli)) {
        devices.push(mr2000fromDatabaseEntry(instance));
      }
    });

    // Add all allowed MR3000 instances
    mr3000instances.forEach((instance) => {
      if (user.mr3000instances.includes(instance.cli)) {
        devices.push(mr3000fromDatabaseEntry(instance));
      }
    });

    return devices;
  }

  /**
   * Returns a list the devices belonging to a given project
   * @param {GetProjectDevicesArgs} getProjectDevicesArgs - contains project name
   * @returns {Promise<MR2000|MR3000[]>} - the user's devices
   */
  async getProjectDevices(getProjectDevicesArgs: GetProjectDevicesArgs) {
    // Note that in the actual database, project names may contain trailing whitespace (but is ignores by SQL)
    const filterQuery = `WHERE comment='${getProjectDevicesArgs.name}'`;

    // Get all MR2000 & MR3000 instances
    const mr2000instances = await fetchFromTable(
      'MR2000',
      'station',
      filterQuery,
    );
    const mr3000instances = await fetchFromTable(
      'MR3000',
      'station',
      filterQuery,
    );

    const devices = [];

    // Add all MR2000 instances
    mr2000instances.forEach((instance) => {
      devices.push(mr2000fromDatabaseEntry(instance));
    });

    // Add all MR3000 instances
    mr3000instances.forEach((instance) => {
      devices.push(mr3000fromDatabaseEntry(instance));
    });

    return devices;
  }
}
