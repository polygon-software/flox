import { AnnouncementResolver } from './announcement.resolver';
import { AnnouncementService } from './announcement.service';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';
import { User } from '../user/entities/user.entity';
import { Notification } from '../notification/entities/notification.entity';

describe('AnnouncementResolver', () => {
  let announcementResolver: AnnouncementResolver;
  let announcementService: AnnouncementService;
  let announcementRepository: Repository<Announcement>;
  let userService: UserService;
  let notificationService: NotificationService;
  let userRepository: Repository<User>;
  let notificationRepository: Repository<Notification>;

  beforeEach(async () => {
    notificationRepository = new Repository<Notification>();
    userRepository = new Repository<User>();
    announcementRepository = new Repository<Announcement>();

    notificationService = new NotificationService(
      notificationRepository,
      userRepository,
      announcementRepository,
    );
    userService = new UserService(userRepository, notificationService);
    announcementService = new AnnouncementService(
      announcementRepository,
      userService,
      notificationService,
    );

    announcementResolver = new AnnouncementResolver(announcementService);
  });

  it('should be defined', () => {
    expect(announcementResolver).toBeDefined();
  });
});
