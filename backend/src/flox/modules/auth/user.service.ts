import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import AbstractSearchService from '../abstracts/search/abstract-search.service';

import User from './entities/user.entity';
import CreateUserInput from './dto/input/create-user.input';

@Injectable()
export default class UserService extends AbstractSearchService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  /**
   * @returns user repository
   */
  get repository(): Repository<User> {
    return this.userRepository;
  }

  /**
   * Gets a user by UUID
   *
   * @param args - input arguments
   * @param args.uuid - uuid of user
   * @param args.cognitoUuid - cognito id of user
   * @returns the user
   */
  getUser({
    uuid,
    cognitoUuid,
  }: {
    uuid?: string;
    cognitoUuid?: string;
  }): Promise<User> {
    if (uuid) {
      return this.userRepository.findOneOrFail({
        where: { uuid },
      });
    }

    if (cognitoUuid) {
      return this.userRepository.findOneOrFail({
        where: {
          cognitoUuid,
        },
      });
    }

    throw new Error(
      'getUser must be called with either uuid or cognitoUuid parameter',
    );
  }

  /**
   * Return current user given the Cognito user from the request
   *
   * @param user - database user from request
   * @returns user
   */
  async getMyUser(user: User): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: {
        uuid: user.uuid,
      },
    });
  }
}
