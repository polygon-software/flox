import { Injectable } from '@nestjs/common';
import { CreateNotificationInput } from './dto/input/create-notification.input';
import { UpdateNotificationInput } from './dto/input/update-notification.input';
import { DeleteNotificationInput } from './dto/input/delete-notification.input';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    private readonly userService: UserService,
  ) {}

  /**
   * Creates a new notification on the database.
   * @param {CreateNotificationInput} createNotificationInput - input values
   * @returns {Promise<Notification>} - the database notification
   */
  async create(
    createNotificationInput: CreateNotificationInput,
  ): Promise<Notification> {
    // Find user for UUID
    const user = await this.userService.getUser({
      uuid: createNotificationInput.userUuid,
    });

    if (!user) {
      throw Error('No User found');
    }

    const notification = this.notificationsRepository.create({
      title: createNotificationInput.title,
      received: createNotificationInput.received,
      content: createNotificationInput.content,
      isRead: createNotificationInput.isRead,
      user,
      announcement: createNotificationInput.announcement,
    });
    return this.notificationsRepository.save(notification);
  }

  /**
   * Updates a notification on the database.
   * @param {UpdateNotificationInput} updateNotificationInput - updated fields
   * @returns {Promise<Notification>} - updated notification
   */
  async update(
    updateNotificationInput: UpdateNotificationInput,
  ): Promise<Notification> {
    const notification = this.notificationsRepository.create(
      updateNotificationInput,
    );
    await this.notificationsRepository.update(
      updateNotificationInput.uuid,
      notification,
    );
    return this.notificationsRepository.findOne(updateNotificationInput.uuid);
  }

  /**
   * Deletes a notification on the DB.
   * @param {DeleteNotificationInput} deleteNotificationInput - uuid
   * @returns {Promise<Notification>} - deleted notification
   */
  async delete(
    deleteNotificationInput: DeleteNotificationInput,
  ): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne(
      deleteNotificationInput.uuid,
    );
    const uuid = notification.uuid;
    const deletedNotification = await this.notificationsRepository.remove(
      notification,
    );
    deletedNotification.uuid = uuid;
    return deletedNotification;
  }

  /**
   * Returns the current notifications of a user.
   * Current means, that the notification date lays before now.
   * @param {Record<string, string>} user - user data from request.
   * @returns {Promise<Notification[]>} - current notifications of the user.
   */
  async currentUserNotifications(
    user: Record<string, string>,
  ): Promise<Notification[]> {
    const now = new Date();
    return this.notificationsRepository.find({
      where: {
        user: { uuid: user.userId },
        received: LessThan(now.toISOString()),
      },
    });
  }
}
