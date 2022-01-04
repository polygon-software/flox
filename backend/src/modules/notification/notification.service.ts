import { Injectable } from '@nestjs/common';
import { CreateNotificationInput } from './dto/input/create-notification.input';
import { UpdateNotificationInput } from './dto/input/update-notification.input';
import { GetNotificationArgs } from './dto/args/get-notification.args';
import { GetNotificationsArgs } from './dto/args/get-notifications.args';
import { DeleteNotificationInput } from './dto/input/delete-notification.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async create(
    createNotificationInput: CreateNotificationInput,
  ): Promise<Notification> {
    // Create the notification
    const notification = this.notificationsRepository.create(
      createNotificationInput,
    );
    return await this.notificationsRepository.save(notification);
  }

  getNotifications(
    getNotificationsArgs: GetNotificationsArgs,
  ): Promise<Notification[]> {
    if (getNotificationsArgs.uuids !== undefined) {
      return this.notificationsRepository.findByIds(getNotificationsArgs.uuids);
    } else {
      return this.notificationsRepository.find();
    }
  }

  getAllNotifications(): Promise<Notification[]> {
    return this.notificationsRepository.find();
  }

  getNotification(
    getNotificationArgs: GetNotificationArgs,
  ): Promise<Notification> {
    return this.notificationsRepository.findOne(getNotificationArgs.uuid);
  }

  /**
   * Updates an existing notification
   * @param {UpdateNotificationInput} updateNotificationInput - update notification input
   * @returns {Promise<Notification>} - updated notification
   */
  async update(
    updateNotificationInput: UpdateNotificationInput,
  ): Promise<Notification> {
    // Update the notification
    const notification = this.notificationsRepository.create(
      updateNotificationInput,
    );
    await this.notificationsRepository.update(
      updateNotificationInput.uuid,
      notification,
    );
    return await this.notificationsRepository.findOne(
      updateNotificationInput.uuid,
    );
  }

  async remove(
    deleteNotificationInput: DeleteNotificationInput,
  ): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne(
      deleteNotificationInput.uuid,
    );
    const uuid = notification.uuid;
    const deleted_notification = await this.notificationsRepository.remove(
      notification,
    );
    deleted_notification.uuid = uuid;
    return deleted_notification;
  }
}
