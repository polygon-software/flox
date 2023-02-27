import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MockType, repositoryMockFactory } from '../../testing/testUtils';
import { DefaultRoles } from '../roles/config';
import EmailService from '../email/email.service';

import CreateUserInput from './dto/input/create-user.input';
import User from './entities/user.entity';
import UserResolver from './user.resolver';
import UserService from './user.service';

describe('UserResolver', () => {
  let userService: UserService;
  let emailService: EmailService;
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
    emailService = module.get<EmailService>(EmailService);
    userRepository = module.get(getRepositoryToken(User));
    userResolver = new UserResolver(userService, emailService);
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
      lang: 'en',
      role: DefaultRoles.ADMIN,
    };

    const date = new Date();

    const user: User = {
      uuid: 'test-UUID-1234',
      createdAt: date,
      updatedAt: date,
      validateRole: jest.fn(),
      validateLang: jest.fn(),
      groups: [],
      ...input,
    };

    // eslint-disable-next-line @typescript-eslint/require-await
    jest.spyOn(userService, 'create').mockImplementation(async () => user);

    // Create user
    expect(await userResolver.createUser(input)).toBe(user);
  });
});
