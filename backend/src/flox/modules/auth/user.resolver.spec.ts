import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/input/create-user.input';
import { DEFAULT_ROLES } from '../roles/config';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '../../testing/testUtils';

describe('UserResolver', () => {
  let userService: UserService;
  let userResolver: UserResolver;
  let userRepository: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        // Provide your mock instead of the actual repository
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
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
      validateRole: jest.fn(),
      ...input,
    };

    jest.spyOn(userService, 'createUser').mockImplementation(async () => user);

    // Create user
    expect(await userResolver.createUser(input)).toBe(user);
  });
});
