import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

describe('UserResolver', () => {
  let userRepository: Repository<User>;
  let userService: UserService;
  let userResolver: UserResolver;

  beforeEach(async () => {
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

  // it('should create a user', async () => {
  //   // No users present at start
  //   let numberOfUsers = await userRepository.count();
  //   expect(numberOfUsers).toBe(0);
  //
  //   const input: CreateUserInput = {
  //     username: 'Test User',
  //     email: 'test@test.com',
  //     cognitoUuid: '1234-abcd-4567',
  //     role: DEFAULT_ROLES.ADMIN,
  //   };
  //
  //   // Create user
  //   await userResolver.createUser(input);
  //
  //   // Ensure user was created
  //   numberOfUsers = await userRepository.count();
  //   expect(numberOfUsers).toBe(1);
  // });

  // it('should throw an error when creating a user with a disallowed role', () => {
  //   expect(userResolver).toBeDefined();
  // });
});
