import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '../auth/entities/user.entity';

import Notification from './entities/notification.entity';
import NotifyUsersInput from './dto/input/notify-users.input';
import Message from './entities/message.entity';

@Injectable()
export default class NotificationService {
  /**
   * @param messageRepository - message repository
   * @param notificationRepository - notification repository
   */
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
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
        recipient: true,
        messages: true,
      },
      where: {
        read: false,
        recipient: {
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
        recipient: true,
        messages: true,
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
      notifyUsersInput.recipients.map(async (uuid) => {
        const notification = this.notificationRepository.create({
          recipient: { uuid },
          ...notifyUsersInput,
        });
        return this.notificationRepository.save(notification);
      }),
    );
  }
}
