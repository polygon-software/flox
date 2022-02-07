import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';
import { Notification } from '../notification/entities/notification.entity';
import { Announcement } from '../announcement/entities/announcement.entity';

describe('UsersResolver', () => {
  let userResolver: UserResolver;
  let userService: UserService;
  let userRepository: Repository<User>;
  let notificationService: NotificationService;
  let notificationRepository: Repository<Notification>;
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
    userService = new UserService(userRepository, notificationService);

    userResolver = new UserResolver(userService);
  });

  it('should be defined', () => {
    expect(userResolver).toBeDefined();
  });
});
