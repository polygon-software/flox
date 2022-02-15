import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { NotificationService } from '../notification/notification.service';
import { Notification } from '../notification/entities/notification.entity';
import { Announcement } from '../announcement/entities/announcement.entity';

describe('UsersService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let notificationService: NotificationService;
  let notificationRepository: Repository<Notification>;
  let announcementRepository: Repository<Announcement>;

  beforeEach(async () => {
    userRepository = new Repository<User>();
    notificationRepository = new Repository<Notification>();
    announcementRepository = new Repository<Announcement>();

    notificationService = new NotificationService(
      notificationRepository,
      userRepository,
      announcementRepository,
    );
    userService = new UserService(userRepository, notificationService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});
