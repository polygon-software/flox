import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../user/entities/user.entity';
import { Announcement } from '../announcement/entities/announcement.entity';

describe('NotificationsResolver', () => {
  let notificationService: NotificationService;
  let notificationRepository: Repository<Notification>;
  let notificationResolver: NotificationResolver;
  let userRepository: Repository<User>;
  let announcementRepository: Repository<Announcement>;

  beforeEach(async () => {
    notificationRepository = new Repository<Notification>();
    userRepository = new Repository<User>();
    announcementRepository = new Repository<Announcement>();

    notificationService = new NotificationService(
      notificationRepository,
      userRepository,
      announcementRepository,
    );

    notificationResolver = new NotificationResolver(notificationService);
  });

  it('should be defined', () => {
    expect(notificationResolver).toBeDefined();
  });
});
