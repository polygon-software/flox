import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { CreateNotificationInput } from './dto/input/create-notification.input';
import { UpdateNotificationInput } from './dto/input/update-notification.input';
import { DeleteNotificationInput } from './dto/input/delete-notification.input';
import { Notification } from './entities/notification.entity';
import { AnyRole, CurrentUser } from '../../auth/authorization.decorator';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationsService: NotificationService) {}

  @Mutation(() => Notification)
  async createNotification(
    @Args('createNotificationInput')
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
  async deleteNotification(
    @Args('deleteNotificationInput')
    deleteNotificationInput: DeleteNotificationInput,
  ): Promise<Notification> {
    return this.notificationsService.delete(deleteNotificationInput);
  }

  @AnyRole()
  @Query(() => [Notification], { name: 'myNotifications' })
  async myNotifications(
    @CurrentUser() user: Record<string, string>,
  ): Promise<Array<Notification>> {
    return this.notificationsService.currentUserNotifications(user);
  }

  @AnyRole()
  @Mutation(() => Notification)
  async markNotificationAsRead(
    @Args('uuid') uuid: string,
  ): Promise<Notification> {
    return this.notificationsService.update({
      uuid: uuid,
      isRead: true,
    } as UpdateNotificationInput);
  }
}
