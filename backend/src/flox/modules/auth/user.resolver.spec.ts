import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForbiddenException } from '@nestjs/common';

import { MockType, repositoryMockFactory } from '../../testing/testUtils';
import { DefaultRoles } from '../roles/config';

import CreateUserInput from './dto/input/create-user.input';
import User from './entities/user.entity';
import UserResolver from './user.resolver';
import UserService from './user.service';
import UpdateUserInput from './dto/input/update-user.input';

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
      cognitoUuid: 'a2ec1728-da5c-4058-ab05-d2bc924c86c0',
      lang: 'en',
      role: DefaultRoles.ADMIN,
    };

    const date = new Date();
    user = {
      uuid: '423f61a8-b433-53fa-a994-f6a249698166',
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
          return {
            getMyUser: jest.fn().mockResolvedValue(user),
            getUser: jest.fn().mockResolvedValue(user),
            getAll: jest.fn().mockResolvedValue([user]),
            search: jest.fn().mockResolvedValue({ count: 1, data: [user] }),
            create: jest.fn().mockResolvedValue(user),
            update: jest.fn().mockResolvedValue(user),
            delete: jest.fn().mockResolvedValue(user),
            getMultiple: jest.fn().mockResolvedValue([user]),
          };
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
    expect(userService).not.toBeNull();
    expect(userService).toBeDefined();
  });

  it('resolver should be defined', () => {
    expect(userResolver).not.toBeNull();
    expect(userResolver).toBeDefined();
  });

  it('return service', () => {
    expect(userResolver.service).toBe(userService);
  });

  it('should call create() in service', async () => {
    // Create user
    expect(await userResolver.createUser(input)).toEqual(user);
  });

  it('should call delete() in service', async () => {
    // Delete user
    expect(
      await userResolver.deleteUser({
        uuid: 'a2ec1728-da5c-4058-ab05-d2bc924c86c1',
      }),
    ).toEqual(user);
  });

  it('should call search() in service ', async () => {
    // Search user
    expect(
      await userResolver.searchUsers({
        filter: 'Test',
        sortBy: 'Test',
        descending: 'DESC',
        skip: 0,
        take: 0,
      }),
    ).toEqual({ count: 1, data: [user] });
  });

  it('should call getMyUser() in service', async () => {
    // Get my users
    expect(await userResolver.myUser(user)).toEqual(user);
  });

  it('should call getUser() in service', async () => {
    // Get a user
    expect(
      await userResolver.getUser({
        cognitoUuid: 'a2ec1728-da5c-4058-ab05-d2bc924c86c1',
        uuid: '423f61a8-b433-53fa-a994-f6a249698162',
      }),
    ).toEqual(user);
  });

  it('should call getAll() in service', async () => {
    // Get all users
    expect(await userResolver.getAllUsers({ take: 100, skip: 0 })).toEqual([
      user,
    ]);
  });

  it('should getMultiple() in service', async () => {
    // Get multiple users
    expect(
      await userResolver.getMultipleUsers({
        uuids: ['a2ec1728-da5c-4058-ab05-d2bc924c86c0'],
      }),
    ).toEqual([user]);
  });

  it('should not update other users as not admin', async () => {
    const date = new Date();
    const userAsEditor: User = {
      uuid: '423f61a8-b433-53fa-a994-f6a249698333',
      createdAt: date,
      validateRole: jest.fn(),
      validateLang: jest.fn(),
      groups: [],
      ...input,
    };

    const updateUserInput: UpdateUserInput = {
      uuid: 'c3135656-9800-4053-90f1-f39de32e1285',
      username: 'Ralf',
    };

    // get list of roles but admin role
    const roles: string[] = Object.values(DefaultRoles);
    const index = roles.indexOf(DefaultRoles.ADMIN, 0);
    if (index > -1) {
      roles.splice(index, 1);
    }

    const promiseList = roles.map(async (role) => {
      userAsEditor.role = role;
      // Don't update users when no rights
      // Need try/catch here because of the async function
      try {
        await userResolver.updateUser(updateUserInput, userAsEditor);
      } catch (e) {
        if (e instanceof ForbiddenException) {
          expect(e.message).toEqual('Forbidden');
          return;
        }
      }
      // The test should fail when this part is reached, because no error was thrown
      expect(false).toBe(true);
    });
    await Promise.all(promiseList);
  });

  it('should update self, regardless of the role', async () => {
    const userAsEditor: User = user;

    // Same uuid as user
    const updateUserInput: UpdateUserInput = {
      uuid: '423f61a8-b433-53fa-a994-f6a249698166',
      username: 'Ralf',
    };

    // get list of roles
    const roles: string[] = Object.values(DefaultRoles);

    const promiseList = roles.map(async (role) => {
      userAsEditor.role = role;
      expect(
        await userResolver.updateUser(updateUserInput, userAsEditor),
      ).toEqual(user);
    });
    await Promise.all(promiseList);
  });
});
