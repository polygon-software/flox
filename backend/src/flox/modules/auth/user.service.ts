import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import AbstractSearchService from '../abstracts/search/abstract-search.service';
import UpdateInput from '../abstracts/crud/inputs/update.input';

import User from './entities/user.entity';
import {
  disableCognitoAccount,
  enableCognitoAccount,
} from './helpers/cognito.helper';

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

  /**
   * Disables a given user's account by UUID (user UUID, not cognito UUID)
   *
   * @param disableInput - contains UUID
   * @returns user
   */
  async disableUser(disableInput: UpdateInput): Promise<User> {
    const user = await this.userRepository.findOneOrFail({
      where: {
        uuid: disableInput.uuid,
      },
    });

    // Disable on cognito
    await disableCognitoAccount(user.email);

    return user;
  }

  /**
   * Re-enables a given user's account by UUID (user UUID, not cognito UUID)
   *
   * @param enableInput - contains UUID
   * @returns user
   */
  async enableUser(enableInput: UpdateInput): Promise<User> {
    const user = await this.userRepository.findOneOrFail({
      where: {
        uuid: enableInput.uuid,
      },
    });

    // Enable on cognito
    await enableCognitoAccount(user.email);

    return user;
  }
}
