import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { GetUsersArgs } from './dto/args/get-users.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {
  disableCognitoAccount,
  enableCognitoAccount,
} from '../../auth/authService';
import { Bank } from '../bank/entities/bank.entity';
import { SoiEmployee } from '../SOI-Employee/entities/soi-employee.entity';
import { Employee } from '../employee/entities/employee.entity';
import { Company } from '../company/entities/company.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
    @InjectRepository(SoiEmployee)
    private readonly soiEmployeeRepository: Repository<SoiEmployee>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  /**
   * Create User
   * @param {CreateUserInput} createUserInput - user input
   * @returns {Promise<User>} - new user
   */
  async create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.usersRepository.create(createUserInput);
    return this.usersRepository.save(user);
  }

  /**
   * Get Users
   * @param {GetUsersArgs} getUsersArgs - get Users args
   * @returns {Promise<User[]>} - array of users
   */
  getUsers(getUsersArgs: GetUsersArgs): Promise<User[]> {
    if (getUsersArgs.uuids !== undefined) {
      return this.usersRepository.findByIds(getUsersArgs.uuids);
    } else {
      return this.usersRepository.find();
    }
  }

  /**
   * Get all Users
   * @returns {Promise<User[]>} - array of all users
   */
  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Get User
   * @param {GetUserArgs} getUserArgs - get User args
   * @returns {Promise<User>} - user
   */
  getUser(getUserArgs: GetUserArgs): Promise<User> {
    return this.usersRepository.findOne(getUserArgs.uuid);
  }

  /**
   * Update a User
   * @param {UpdateUserInput} updateUserInput - fields to update
   * @returns {Promise<User>} - user
   */
  async update(updateUserInput: UpdateUserInput): Promise<User> {
    const user = this.usersRepository.create(updateUserInput);
    await this.usersRepository.update(updateUserInput.uuid, user);
    return this.usersRepository.findOne(updateUserInput.uuid);
  }

  /**
   * Deletes User
   * @param {DeleteUserInput} deleteUserInput - user to delete
   * @returns {Promise<User>} - user
   */
  async remove(deleteUserInput: DeleteUserInput): Promise<User> {
    const user = await this.usersRepository.findOne(deleteUserInput.uuid);
    const uuid = user.uuid;
    const deletedUser = await this.usersRepository.remove(user);
    deletedUser.uuid = uuid;
    return deletedUser;
  }

  /**
   * Disables a given user's account
   * @param {string} uuid - user's database & cognito UUID
   * @param {string} repositoryName - The name of the repository where the user's entity can be found. Needs to be injected.
   * @returns {Promise<Company|Bank|Employee|SoiEmployee>} - the user after editing
   */
  async disableUser(
    uuid: string,
    repositoryName: string,
  ): Promise<Company | Bank | Employee | SoiEmployee> {
    const user = await this[repositoryName].findOne(uuid);

    // Error checks
    if (!user || !user.email) {
      throw new Error(`Cannot find valid user for UUID ${uuid}`);
    }

    if (!!user.banned_at) {
      throw new Error(`User with UUID ${uuid} is already banned`);
    }

    const email = user.email;

    // Disable cognito account
    await disableCognitoAccount(email).catch((error: Error) => {
      throw error;
    });

    // Disable on database
    await this[repositoryName].update(uuid, {
      banned_at: new Date(),
    });

    return this[repositoryName].findOne(uuid);
  }
}
