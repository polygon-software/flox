import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';

import { LoggedIn } from '../auth/authentication.decorator';
import { AdminOnly, CurrentUser } from '../roles/authorization.decorator';
import User from '../auth/entities/user.entity';
import UserService from '../auth/user.service';

import NotificationService from './notification.service';
import Notification from './entities/notification.entity';
import MarkAsReadInput from './dto/inputs/mark-as-read.input';
import NotifyUsersInput from './dto/inputs/notify-users.input';
import NotifyInput from './dto/inputs/notify.input';

@Resolver(() => Notification)
export default class NotificationResolver {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) {}

  @LoggedIn()
  @Query(() => [Notification], { name: 'UnreadNotifications' })
  async unreadNotifications(
    @CurrentUser() user: User,
  ): Promise<Notification[]> {
    return this.notificationService.getUnreadNotifications(user);
  }

  @LoggedIn()
  @Mutation(() => Notification, { name: 'MarkNotificationAsRead' })
  async markNotificationAsRead(
    @Args('markAsReadInput') markAsReadInput: MarkAsReadInput,
    @CurrentUser() user: User,
  ): Promise<Notification> {
    const notification = await this.notificationService.getNotification(
      markAsReadInput.uuid,
    );
    if (notification.receiver.uuid !== user.uuid) {
      throw new ForbiddenException();
    }
    return this.notificationService.markNotificationAsRead(notification);
  }

  @AdminOnly()
  @Mutation(() => [Notification], { name: 'NotifyUsers' })
  async notifyUsers(
    @Args('notifyUsersInput') notifyUsersInput: NotifyUsersInput,
  ): Promise<Notification[]> {
    return this.notificationService.notifyUsers(notifyUsersInput);
  }

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
      receivers: userUuids,
      ...notifyInput,
    });
  }
}
