import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { CreateNotificationInput } from './dto/input/create-notification.input';
import { UpdateNotificationInput } from './dto/input/update-notification.input';
import { GetNotificationArgs } from './dto/args/get-notification.args';
import { DeleteNotificationInput } from './dto/input/delete-notification.input';
import { Notification } from './entities/notification.entity';
import { GetNotificationsArgs } from './dto/args/get-notifications.args';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationsService: NotificationService) {}

  @Query(() => [Notification], { name: 'notifications' })
  async getNotifications(
    @Args() getNotificationsArgs: GetNotificationsArgs,
  ): Promise<Notification[]> {
    return this.notificationsService.getNotifications(getNotificationsArgs);
  }

  @Query(() => [Notification], { name: 'allNotifications' })
  async getAllNotifications(): Promise<Notification[]> {
    return this.notificationsService.getAllNotifications();
  }

  @Query(() => Notification, { name: 'notification' })
  async getNotification(
    @Args() getNotificationArgs: GetNotificationArgs,
  ): Promise<Notification> {
    return this.notificationsService.getNotification(getNotificationArgs);
  }

  @Mutation(() => Notification)
  async createNotification(
    @Args({
      name: 'createNotificationInput',
      type: () => CreateNotificationInput,
    })
    createNotificationInput: CreateNotificationInput,
  ): Promise<Notification> {
    return this.notificationsService.create(createNotificationInput);
  }

  @Mutation(() => Notification)
  async updateNotification(
    @Args('updateNotificationInput')
    updateNotificationInput: UpdateNotificationInput,
  ): Promise<Notification> {
    return this.notificationsService.update(updateNotificationInput);
  }

  @Mutation(() => Notification)
  async removeNotification(
    @Args('deleteNotificationInput')
    deleteNotificationInput: DeleteNotificationInput,
  ): Promise<Notification> {
    return this.notificationsService.remove(deleteNotificationInput);
  }
}
