import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    userRepository = new Repository<User>();
    userService = new UserService(userRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});
