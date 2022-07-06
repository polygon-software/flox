import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/input/create-user.input';
import { DEFAULT_ROLES } from '../roles/config';
import { Repository } from 'typeorm';

describe('UserResolver', () => {
  let userRepository: Repository<User>;
  let userService: UserService;
  let userResolver: UserResolver;

  beforeEach(() => {
    userRepository = new Repository<User>();
    userService = new UserService(userRepository);
    userResolver = new UserResolver(userService);
  });

  it('repository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  it('service should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('resolver should be defined', () => {
    expect(userResolver).toBeDefined();
  });

  it('should create a user', async () => {
    const input: CreateUserInput = {
      username: 'Test User',
      email: 'test@test.com',
      cognitoUuid: '1234-abcd-4567',
      role: DEFAULT_ROLES.ADMIN,
    };

    const date = new Date();

    const user: User = {
      uuid: 'test-UUID-1234',
      createdAt: date,
      updatedAt: date,
      deletedAt: null,
      validateRole: jest.fn(),
      ...input,
    };

    jest.spyOn(userService, 'createUser').mockImplementation(async () => user);

    // Create user
    expect(await userResolver.createUser(input)).toBe(user);
  });
});
