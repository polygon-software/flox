import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { GetUsersArgs } from './dto/args/get-users.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SearchQueryInterfaceService } from '../interfaces/search-query-interface.service';
import { SearchQueryArgs } from '../interfaces/dto/args/search-query.args';
import { UserQueryOutput } from './output/user-query.output';

@Injectable()
export class UserService implements SearchQueryInterfaceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Query for users
   * @param {SearchQueryArgs} queryArgs - query arguments including limit, etc.
   * @returns {Promise<UserQueryOutput>} users that fit query
   */
  async queryAll(queryArgs: SearchQueryArgs): Promise<UserQueryOutput> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, count] = await this.userRepository.findAndCount({
      order: {
        [queryArgs.sortBy]: queryArgs.descending ? 'DESC' : 'ASC',
      },
      where: {
        username: Like(`%${queryArgs.filter}%`),
      },
    });

    const data = await this.userRepository.find({
      order: {
        [queryArgs.sortBy]: queryArgs.descending ? 'DESC' : 'ASC',
      },
      skip: queryArgs.skip,
      take: queryArgs.limit,
      where: {
        username: Like(`%${queryArgs.filter}%`),
      },
    });
    console.log(data, count);
    return { data, count };
  }

  /**
   * Creates a User
   * @param {CreateUserInput} createUserInput - contains all user data
   * @returns {Promise<User>} - the newly created user
   */
  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const user = this.userRepository.create(createUserInput);
    return this.userRepository.save(user);
  }

  /**
   * Gets a set of users by UUID
   * @param {GetUsersArgs} getUsersArgs - contains UUIDs of users
   * @returns {Promise<User[]>} - the users
   */
  getUsers(getUsersArgs: GetUsersArgs): Promise<User[]> {
    if (getUsersArgs.uuids !== undefined) {
      return this.userRepository.findByIds(getUsersArgs.uuids);
    } else {
      return this.userRepository.find();
    }
  }

  /**
   * Gets all users
   * @returns {Promise<User[]>} - the users
   */
  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Gets a user by UUID
   * @param {GetUserArgs} getUserArgs - contains UUID
   * @returns {Promise<User>} - the user
   */
  getUser(getUserArgs: GetUserArgs): Promise<User> {
    if (getUserArgs.uuid) {
      return this.userRepository.findOne({ where: { uuid: getUserArgs.uuid } });
    }

    if (getUserArgs.cognitoUuid) {
      return this.userRepository.findOne({
        where: {
          cognitoUuid: getUserArgs.cognitoUuid,
        },
      });
    }

    throw new Error(
      'getUser must be called with either uuid or cognitoUuid parameter',
    );
  }

  /**
   * Updates a given user
   * @param {UpdateUserInput} updateUserInput - contains UUID and any new user data
   * @returns {Promise<User>} - the updated user
   */
  async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
    const user = this.userRepository.create(updateUserInput);
    await this.userRepository.update(updateUserInput.uuid, user);
    return this.userRepository.findOne({
      where: { uuid: updateUserInput.uuid },
    });
  }

  /**
   * Deletes a given user
   * @param {DeleteUserInput} deleteUserInput - contains UUID
   * @returns {Promise<User>} - the deleted user
   */
  async deleteUser(deleteUserInput: DeleteUserInput): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { uuid: deleteUserInput.uuid },
    });
    const uuid = user.uuid;
    const deletedUser = await this.userRepository.remove(user);
    deletedUser.uuid = uuid;
    return deletedUser;
  }

  /**
   * Return current user given the Cognito user from the request
   * @param {Record<string, string>} cognitoUser - cognito user from request
   * @returns {Promise<User>} - user
   */
  async getMyUser(cognitoUser: Record<string, string>): Promise<User> {
    const myUser = await this.userRepository.findOne({
      where: {
        cognitoUuid: cognitoUser.userId,
      },
    });

    if (!myUser) {
      throw new Error(`No user found for ${cognitoUser.userId}`);
    }
    return myUser;
  }
}
