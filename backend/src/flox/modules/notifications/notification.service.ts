import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '../auth/entities/user.entity';

import Notification from './entities/notification.entity';
import NotifyUsersInput from './dto/inputs/notify-users.input';

@Injectable()
export default class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  getUnreadNotifications(user: User): Promise<Notification[]> {
    console.log(user);
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

  async markNotificationAsRead(
    notification: Notification,
  ): Promise<Notification> {
    await this.notificationRepository.update(notification.uuid, {
      read: true,
    });
    return this.getNotification(notification.uuid);
  }

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
