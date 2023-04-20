import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';

import { LoggedIn } from '../auth/authentication.decorator';
import { AdminOnly, CurrentUser } from '../roles/authorization.decorator';
import User from '../auth/entities/user.entity';
import UserService from '../auth/user.service';

import NotificationService from './notification.service';
import Notification from './entities/notification.entity';
import MarkAsReadInput from './dto/input/mark-as-read.input';
import NotifyUsersInput from './dto/input/notify-users.input';
import NotifyInput from './dto/input/notify.input';

@Resolver(() => Notification)
export default class NotificationResolver {
  /**
   * @param notificationService - notification service
   * @param userService - user service
   */
  constructor(
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) {}

  /**
   * Returns all unread notifications for a user
   *
   * @param user - user from which notifications are retrieved
   * @returns list of unread notifications
   */
  @LoggedIn()
  @Query(() => [Notification], { name: 'UnreadNotifications' })
  async unreadNotifications(
    @CurrentUser() user: User,
  ): Promise<Notification[]> {
    return this.notificationService.getUnreadNotifications(user);
  }

  /**
   * Marks a notification as read by the user
   *
   * @param markAsReadInput - contains notification uuid
   * @param user - the logged in user
   * @returns the updated notification
   */
  @LoggedIn()
  @Mutation(() => Notification, { name: 'MarkNotificationAsRead' })
  async markNotificationAsRead(
    @Args('markAsReadInput') markAsReadInput: MarkAsReadInput,
    @CurrentUser() user: User,
  ): Promise<Notification> {
    const notification = await this.notificationService.getNotification(
      markAsReadInput.uuid,
    );
    if (notification.recipient.uuid !== user.uuid) {
      throw new ForbiddenException();
    }
    return this.notificationService.markNotificationAsRead(notification);
  }

  /**
   * Sends a notification to a set of users
   *
   * @param notifyUsersInput - contains notification data and list of user uuids
   * @returns list of sent out notifications
   */
  @AdminOnly()
  @Mutation(() => [Notification], { name: 'NotifyUsers' })
  async notifyUsers(
    @Args('notifyUsersInput') notifyUsersInput: NotifyUsersInput,
  ): Promise<Notification[]> {
    return this.notificationService.notifyUsers(notifyUsersInput);
  }

  /**
   * Sends a notification to all users
   *
   * @param notifyInput - contains notification data
   * @returns list of sent out notifications
   */
  @AdminOnly()
  @Mutation(() => [Notification], { name: 'NotifyAllUsers' })
  async notifyAllUsers(
    @Args('notifyInput') notifyInput: NotifyInput,
  ): Promise<Notification[]> {
    const users = await this.userService.getAll(
      { take: 5000, skip: 0 },
      { select: { uuid: true } },
    );
    const userUuids = users.map((user) => user.uuid);
    return this.notificationService.notifyUsers({
      recipients: userUuids,
      ...notifyInput,
    });
  }
}
