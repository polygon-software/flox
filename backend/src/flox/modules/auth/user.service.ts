import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import AbstractSearchService from '../abstracts/search/abstract-search.service';
import UpdateInput from '../abstracts/crud/inputs/update.input';

import User from './entities/user.entity';
import {
  disableCognitoAccount,
  enableCognitoAccount,
  forceUserPasswordChange,
  isUserEnabled,
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

    const isEnabled = await isUserEnabled(user.email);
    if (!isEnabled) {
      throw new Error(`User with email ${user.email} is already disabled`);
    }

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

    const isEnabled = await isUserEnabled(user.email);
    if (isEnabled) {
      throw new Error(`User with email ${user.email} is already enabled`);
    }

    // Enable on cognito
    await enableCognitoAccount(user.email);

    return user;
  }

  /**
   * Forces a user to change their password
   *
   * @param changeInput - contains UUID
   * @returns the user whose password was force-changed
   */
  async forceUserPasswordChange(changeInput: UpdateInput): Promise<User> {
    const user = await this.userRepository.findOneOrFail({
      where: {
        uuid: changeInput.uuid,
      },
    });

    // Force password change & get temporary password
    const tempPassword = await forceUserPasswordChange(user.email);

    // TODO application specific: send E-mail informing the user that their password was changed

    return user;
  }
}
