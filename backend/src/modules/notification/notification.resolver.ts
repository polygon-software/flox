import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { UpdateNotificationInput } from './dto/input/update-notification.input';
import { Notification } from './entities/notification.entity';
import { AnyRole, CurrentUser } from '../../auth/authorization.decorator';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationsService: NotificationService) {}

  @AnyRole()
  @Query(() => [Notification], { name: 'myNotifications' })
  async myNotifications(
    @CurrentUser() user: Record<string, string>,
  ): Promise<Notification[]> {
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
