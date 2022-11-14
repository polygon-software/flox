import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '../auth/entities/user.entity';

import Notification from './entities/notification.entity';
import NotifyUsersInput from './dto/inputs/notify-users.input';

@Injectable()
export default class NotificationService {
  /**
   * @param notificationRepository - notification repository
   */
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  /**
   * Returns all unread notifications for a user
   *
   * @param user - user from which notifications are retrieved
   * @returns list of unread notifications
   */
  getUnreadNotifications(user: User): Promise<Notification[]> {
    return this.notificationRepository.find({
      relations: {
        receiver: true,
      },
      where: {
        read: false,
        receiver: {
          uuid: user.uuid,
        },
      },
    });
  }

  /**
   * Gets one specific notifications
   *
   * @param notificationUuid - uuid of notification
   * @returns notification
   */
  getNotification(notificationUuid: string): Promise<Notification> {
    return this.notificationRepository.findOneOrFail({
      relations: {
        receiver: true,
      },
      where: {
        uuid: notificationUuid,
      },
    });
  }

  /**
   * Marks a notification as read by the user
   *
   * @param notification - notification that is marked as read
   * @returns the updated notification
   */
  async markNotificationAsRead(
    notification: Notification,
  ): Promise<Notification> {
    await this.notificationRepository.update(notification.uuid, {
      read: true,
    });
    return this.getNotification(notification.uuid);
  }

  /**
   * Sends a notification to a set of users
   *
   * @param notifyUsersInput - contains notification data and list of user uuids
   * @returns list of sent out notifications
   */
  async notifyUsers(
    notifyUsersInput: NotifyUsersInput,
  ): Promise<Notification[]> {
    return Promise.all(
      notifyUsersInput.receivers.map((uuid) => {
        const notification = this.notificationRepository.create({
          receiver: { uuid },
          ...notifyUsersInput,
        });
        return this.notificationRepository.save(notification);
      }),
    );
  }
}
