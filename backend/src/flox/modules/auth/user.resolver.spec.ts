import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MockType, repositoryMockFactory } from '../../testing/testUtils';
import { DefaultRoles } from '../roles/config';

import CreateUserInput from './dto/input/create-user.input';
import User from './entities/user.entity';
import UserResolver from './user.resolver';
import UserService from './user.service';

describe('UserResolver', () => {
  let userService: UserService;
  let userResolver: UserResolver;
  let userRepository: MockType<Repository<User>>;
  let user: User;
  let input: CreateUserInput;

  beforeEach(async () => {
    input = {
      username: 'Test User',
      email: 'test@test.com',
      cognitoUuid: '1234-abcd-4567',
      lang: 'en',
      role: DefaultRoles.ADMIN,
    };

    const date = new Date();
    user = {
      uuid: 'test-UUID-1234',
      createdAt: date,
      validateRole: jest.fn(),
      validateLang: jest.fn(),
      groups: [],
      ...input,
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserResolver],
      providers: [
        // Provide your mock instead of the actual repository
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    })
      // eslint-disable-next-line consistent-return
      .useMocker((token) => {
        if (token === UserService) {
          return { create: jest.fn().mockResolvedValue(user) };
        }
      })
      .compile();

    userService = module.get(UserService);
    userResolver = module.get(UserResolver);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('repository should be defined', () => {
    expect(userRepository).not.toBeNull();
    expect(userRepository).toBeDefined();
  });

  it('service should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('resolver should be defined', () => {
    expect(userResolver).toBeDefined();
  });

  it('should create a user', async () => {
    // Create user
    expect(await userResolver.createUser(input)).toBe(user);
  });
});
