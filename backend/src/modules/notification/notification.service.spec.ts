import { NotificationService } from './notification.service';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

describe('NotificationsService', () => {
  let notificationService: NotificationService;
  let notificationRepository: Repository<Notification>;

  beforeEach(async () => {
    notificationRepository = new Repository<Notification>();

    notificationService = new NotificationService(notificationRepository);
  });

  it('should be defined', () => {
    expect(notificationService).toBeDefined();
  });
});
