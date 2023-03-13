import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import AbstractSearchService from '../abstracts/search/abstract-search.service';
import UpdateInput from '../abstracts/crud/dto/input/update.input';
import EmailService from '../email/email.service';
import DELIVERY_MEDIUMS from '../../enum/DELIVERY_MEDIUMS';

import User from './entities/user.entity';
import {
  adminCreateCognitoAccount,
  disableCognitoAccount,
  enableCognitoAccount,
  forceUserPasswordChange,
  generatePassword,
  isUserEnabled,
} from './helpers/cognito.helper';
import AdminCreateUserInput from './dto/input/admin-create-user.input';
import GetUserArgs from './dto/args/get-user.args';

@Injectable()
export default class UserService extends AbstractSearchService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
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
        where: { cognitoUuid },
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

    const isEnabled = await isUserEnabled(user.username);
    if (!isEnabled) {
      throw new Error(
        `User with username ${user.username} is already disabled`,
      );
    }

    // Disable on cognito
    await disableCognitoAccount(user.username);

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

    const isEnabled = await isUserEnabled(user.username);
    if (isEnabled) {
      throw new Error(`User with username ${user.username} is already enabled`);
    }

    // Enable on cognito
    await enableCognitoAccount(user.username);

    return user;
  }

  /**
   * TODO
   *
   * @param getUserArgs
   */
  async isUserEnabled(getUserArgs: GetUserArgs): Promise<boolean> {
    const user = await this.getUser(getUserArgs);
    return isUserEnabled(user.email);
  }

  /**
   * Forces a user to change their password by setting a temporary password
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
    const tempPassword = await forceUserPasswordChange(user.username);

    // Send e-mail notifying user that their password was reset
    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.lang,
      tempPassword,
    );

    return user;
  }

  /**
   * Creates a User with a corresponding Cognito account
   *
   * @param adminCreateUserInput - contains all user data
   * @returns the newly created user
   */
  async adminCreateCognitoUser(
    adminCreateUserInput: AdminCreateUserInput,
  ): Promise<{ cognitoUuid: string; password: string }> {
    // Check if input data is valid
    if (
      adminCreateUserInput.deliveryMediums.includes(DELIVERY_MEDIUMS.SMS) &&
      !adminCreateUserInput.phoneNumber
    ) {
      throw new Error(
        "New user can't be created because the phone number is missing and no invitation can be sent",
      );
    }

    let cognitoUuid;
    const password = generatePassword();

    if (
      adminCreateUserInput.deliveryMediums.includes(
        DELIVERY_MEDIUMS.CUSTOM_EMAIL,
      ) &&
      adminCreateUserInput.deliveryMediums.length === 1
    ) {
      // In case a custom e-mail invitation should be sent
      // Create Cognito account
      cognitoUuid = await adminCreateCognitoAccount(
        adminCreateUserInput.username,
        adminCreateUserInput.email,
        password,
        adminCreateUserInput.phoneNumber,
      );

      // Send custom email
      await this.emailService.sendCustomInviteEmail(
        adminCreateUserInput.email,
        adminCreateUserInput.lang,
        password,
      );
    } else {
      // Create cognito account and let cognito send default email or SMS
      cognitoUuid = await adminCreateCognitoAccount(
        adminCreateUserInput.username,
        adminCreateUserInput.email,
        password,
        adminCreateUserInput.phoneNumber,
        adminCreateUserInput.deliveryMediums,
      );
    }

    return { cognitoUuid, password };
  }
}
