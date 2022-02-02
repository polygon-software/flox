import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';
import { Notification } from '../notification/entities/notification.entity';

describe('UsersResolver', () => {
  let userResolver: UserResolver;
  let userService: UserService;
  let userRepository: Repository<User>;
  let notificationService: NotificationService;
  let notificationRepository: Repository<Notification>;

  beforeEach(async () => {
    userRepository = new Repository<User>();
    notificationRepository = new Repository<Notification>();

    notificationService = new NotificationService(notificationRepository);
    userService = new UserService(userRepository, notificationService);

    userResolver = new UserResolver(userService);
  });

  it('should be defined', () => {
    expect(userResolver).toBeDefined();
  });
});
