import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import AbstractSearchService from '../abstracts/search/abstract-search.service';

import GetUserArgs from './dto/args/get-user.args';
import User from './entities/user.entity';

@Injectable()
export default class UserService extends AbstractSearchService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  get repository(): Repository<User> {
    return this.userRepository;
  }

  /**
   * Gets a user by UUID
   * @param getUserArgs - contains UUID
   * @returns the user
   */
  getUser(getUserArgs: GetUserArgs): Promise<User> {
    if (getUserArgs.uuid) {
      return this.userRepository.findOneOrFail({
        where: { uuid: getUserArgs.uuid },
      });
    }

    if (getUserArgs.cognitoUuid) {
      return this.userRepository.findOneOrFail({
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
   * Return current user given the Cognito user from the request
   * @param user - database user from request
   * @returns user
   */
  async getMyUser(user: User): Promise<User> {
    console.log(user);
    return this.userRepository.findOneOrFail({
      where: {
        uuid: user.uuid,
      },
    });
  }
}
