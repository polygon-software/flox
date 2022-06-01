import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/input/create-user.input';
import { DEFAULT_ROLES } from '../roles';

describe('UsersResolver', () => {
  let userResolver: UserResolver;
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    userRepository = new Repository<User>();
    userService = new UserService(userRepository);
    userResolver = new UserResolver(userService);
  });

  it('should be defined', () => {
    expect(userResolver).toBeDefined();
  });

  it('should create a user', async () => {
    // No users present at start
    let numberOfUsers = await userRepository.count();
    expect(numberOfUsers).toBe(0);

    const input: CreateUserInput = {
      username: 'Test User',
      email: 'test@test.com',
      cognitoUuid: '1234-abcd-4567',
      role: DEFAULT_ROLES.ADMIN,
    };

    // Create user
    await userResolver.createUser(input);

    // Ensure user was created
    numberOfUsers = await userRepository.count();
    expect(numberOfUsers).toBe(1);
  });

  // it('should throw an error when creating a user with a disallowed role', () => {
  //   expect(userResolver).toBeDefined();
  // });
});
