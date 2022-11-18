import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';

import User from '../auth/entities/user.entity';
import GetAllArgs from '../abstracts/crud/dto/get-all.args';
import AbstractSearchService from '../abstracts/search/abstract-search.service';
import UserService from '../auth/user.service';
import NotificationService from '../notifications/notification.service';
import Notification from '../notifications/entities/notification.entity';

import UserGroup from './entities/user-group.entity';

@Injectable()
export default class AccessControlService extends AbstractSearchService<UserGroup> {
  constructor(
    @InjectRepository(UserGroup)
    private userGroupRepository: Repository<UserGroup>,
    private readonly i18nService: I18nService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  /**
   * @returns user group repository
   */
  get repository(): Repository<UserGroup> {
    return this.userGroupRepository;
  }

  /**
   * Sends notifications to users that they were added to user group
   *
   * @param userUuids - uuids of users that shall receive notification
   * @param userGroup - user group to which user was added
   */
  async notifyUsersForBeingAdded(
    userUuids: string[],
    userGroup: UserGroup,
  ): Promise<Notification[]> {
    return this.notificationService.notifyUsers({
      recipients: userUuids,
      messages: ['de', 'en'].map((lang) => ({
        lang,
        title: this.i18nService.t(
          'notifications.user_added_to_user_group.title',
          {
            lang,
          },
        ),
        content: this.i18nService.t(
          'notifications.user_added_to_user_group.content',
          {
            lang,
            args: { name: userGroup.name },
          },
        ),
      })),
    });
  }

  /**
   * Sends notifications to users that they were removed from a user group
   *
   * @param userUuids - uuids of users that shall receive notification
   * @param userGroup - user group to which user was removed
   */
  async notifyUsersForBeingRemoved(
    userUuids: string[],
    userGroup: UserGroup,
  ): Promise<Notification[]> {
    return this.notificationService.notifyUsers({
      recipients: userUuids,
      messages: ['de', 'en'].map((lang) => ({
        lang,
        title: this.i18nService.t(
          'notifications.user_removed_from_user_group.title',
          {
            lang,
          },
        ),
        content: this.i18nService.t(
          'notifications.user_removed_from_user_group.content',
          {
            lang,
            args: { name: userGroup.name },
          },
        ),
      })),
    });
  }

  /**
   * Retrieves list of user groups in which the user with the provided uuid is part of
   *
   * @param userUuid - uuid of user
   * @param getAll - contains take and limit parameters
   * @returns list of user groups
   */
  async getUserGroupsForUser(
    userUuid: string,
    getAll: GetAllArgs,
  ): Promise<UserGroup[]> {
    return this.userGroupRepository.find({
      relations: {
        users: true,
      },
      where: {
        users: {
          uuid: userUuid,
        },
      },
      take: getAll.take,
      skip: getAll.skip,
    });
  }

  /**
   * Adds the provided user to a user group
   *
   * @param userGroupUuid - uuid of user group
   * @param user - user that shall be added to user group
   * @returns User group including the newly added user
   */
  async addUserToUserGroup(
    userGroupUuid: string,
    user: User,
  ): Promise<UserGroup> {
    const userGroup = await this.userGroupRepository.findOneOrFail({
      relations: {
        users: true,
      },
      where: {
        uuid: userGroupUuid,
      },
    });
    if (userGroup.users.find((u) => u.uuid === user.uuid)) {
      return userGroup;
    }
    userGroup.users.push(user);
    await this.userGroupRepository.save(userGroup);
    void this.notifyUsersForBeingAdded([user.uuid], userGroup);
    return this.getOne(
      { uuid: userGroup.uuid },
      { relations: { users: true } },
    );
  }

  /**
   * Add multiple users to a user group
   *
   * @param userGroupUuid - uuid of user group
   * @param userUuids - uuids of users to be added
   * @returns User group including the newly added users
   */
  async addUsersToUserGroup(
    userGroupUuid: string,
    userUuids: string[],
  ): Promise<UserGroup> {
    const userGroup = await this.userGroupRepository.findOneOrFail({
      relations: {
        users: true,
      },
      where: {
        uuid: userGroupUuid,
      },
    });
    const users = await this.userService.getMultiple({ uuids: userUuids });
    const existingUserUuids = userGroup.users.map((u) => u.uuid);
    const uniqueUsers = users.filter(
      (user) => !existingUserUuids.includes(user.uuid),
    );
    userGroup.users.push(...uniqueUsers);
    await this.userGroupRepository.save(userGroup);
    void this.notifyUsersForBeingAdded(
      uniqueUsers.map((u) => u.uuid),
      userGroup,
    );
    return this.getOne(
      { uuid: userGroup.uuid },
      { relations: { users: true } },
    );
  }

  /**
   * Removes the provided user from a user group
   *
   * @param userGroupUuid - uuid of user group
   * @param user - user that shall be removed from user group
   * @returns User group without the removed user
   */
  async removeUserFromGroup(
    userGroupUuid: string,
    user: User,
  ): Promise<UserGroup> {
    const userGroup = await this.userGroupRepository.findOneOrFail({
      relations: {
        users: true,
      },
      where: {
        uuid: userGroupUuid,
      },
    });
    userGroup.users = userGroup.users.filter((u) => u.uuid !== user.uuid);
    await this.userGroupRepository.save(userGroup);
    void this.notifyUsersForBeingRemoved([user.uuid], userGroup);
    return this.getOne(
      { uuid: userGroup.uuid },
      { relations: { users: true } },
    );
  }
}
