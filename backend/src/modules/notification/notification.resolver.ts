import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { CreateNotificationInput } from './dto/input/create-notification.input';
import { UpdateNotificationInput } from './dto/input/update-notification.input';
import { DeleteNotificationInput } from './dto/input/delete-notification.input';
import { Notification } from './entities/notification.entity';
import { Public } from '../../auth/authentication.decorator';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationsService: NotificationService) {}

  @Public()
  @Mutation(() => Notification)
  async createNotification(
    @Args('createNotificationInput')
    createNotificationInput: CreateNotificationInput,
  ): Promise<Notification> {
    return this.notificationsService.create(createNotificationInput);
  }

  @Public()
  @Mutation(() => Notification)
  async updateNotification(
    @Args('updateNotificationInput')
    updateNotificationInput: UpdateNotificationInput,
  ): Promise<Notification> {
    return this.notificationsService.update(updateNotificationInput);
  }

  @Public()
  @Mutation(() => Notification)
  async deleteNotification(
    @Args('deleteNotificationInput')
    deleteNotificationInput: DeleteNotificationInput,
  ): Promise<Notification> {
    return this.notificationsService.delete(deleteNotificationInput);
  }
}
