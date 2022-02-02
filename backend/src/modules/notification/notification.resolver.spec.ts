import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

describe('NotificationsResolver', () => {
  let notificationService: NotificationService;
  let notificationRepository: Repository<Notification>;
  let notificationResolver: NotificationResolver;

  beforeEach(async () => {
    notificationRepository = new Repository<Notification>();

    notificationService = new NotificationService(notificationRepository);

    notificationResolver = new NotificationResolver(notificationService);
  });

  it('should be defined', () => {
    expect(notificationResolver).toBeDefined();
  });
});
