import { Injectable } from '@nestjs/common';
import { CreateNotificationInput } from './dto/input/create-notification.input';
import { UpdateNotificationInput } from './dto/input/update-notification.input';
import { DeleteNotificationInput } from './dto/input/delete-notification.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  /**
   * Creates a new notification on the database
   * @param {CreateNotificationInput} createNotificationInput - input values
   * @returns {Notification} - the database notification
   */
  async create(
    createNotificationInput: CreateNotificationInput,
  ): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      ...createNotificationInput,
    });
    return this.notificationsRepository.save(notification);
  }

  async update(
    updateNotificationInput: UpdateNotificationInput,
  ): Promise<Notification> {
    const notification = await this.notificationsRepository.create(
      updateNotificationInput,
    );
    await this.notificationsRepository.update(
      updateNotificationInput.uuid,
      notification,
    );
    return this.notificationsRepository.findOne(updateNotificationInput.uuid);
  }

  async delete(
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
