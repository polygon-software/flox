import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { NotificationService } from '../notification/notification.service';
import { Notification } from '../notification/entities/notification.entity';

describe('UsersService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let notificationService: NotificationService;
  let notificationRepository: Repository<Notification>;

  beforeEach(async () => {
    userRepository = new Repository<User>();
    notificationRepository = new Repository<Notification>();

    notificationService = new NotificationService(notificationRepository);
    userService = new UserService(userRepository, notificationService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});
