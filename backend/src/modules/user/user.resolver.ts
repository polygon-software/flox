import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { GetUserArgs } from './dto/args/get-user.args';
import { User } from './entities/user.entity';
import { GetUsersArgs } from './dto/args/get-users.args';
import {
  AdminOnly,
  AnyRole,
  CurrentUser,
} from '../../auth/authorization.decorator';
import { DisableUserInput } from './dto/input/disable-user.input';
import { Person } from '../person/entities/person.entity';
import { ROLE } from '../../ENUM/ENUMS';
import { ERRORS } from '../../error/ERRORS';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @AdminOnly()
  @Query(() => [User], { name: 'users' })
  async getUsers(@Args() getUsersArgs: GetUsersArgs): Promise<User[]> {
    return this.usersService.getUsers(getUsersArgs);
  }

  @AdminOnly()
  @Query(() => [User], { name: 'allUsers' })
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @AdminOnly()
  @Query(() => User, { name: 'user' })
  async getUser(@Args() getUserArgs: GetUserArgs): Promise<User> {
    return this.usersService.getUser(getUserArgs);
  }

  @AnyRole()
  @Query(() => User, { name: 'getMyUser' })
  async getMyUser(@CurrentUser() user: Record<string, string>): Promise<User> {
    if (!user) {
      throw new Error('No User authenticated');
    }
    return this.usersService.getUser({ uuid: user.userId });
  }

  /**
   * Disables a given user's account
   * @param {DisableUserInput} disableUserInput - disabling input, including UUID & role
   * @returns {Promise<User>} - the user after editing
   */
  @AdminOnly()
  @Mutation(() => Person)
  async disableUser(
    @Args('disableUserInput') disableUserInput: DisableUserInput,
  ): Promise<Person> {
    let repository;

    // Depending on role of the user to ban, pass corresponding repository to service
    switch (disableUserInput.role) {
      case ROLE.BANK:
        repository = 'bankRepository';
        break;
      case ROLE.COMPANY:
        repository = 'companyRepository';
        break;
      case ROLE.SOI_EMPLOYEE:
        repository = 'soiEmployeeRepository';
        break;
      case ROLE.EMPLOYEE:
        repository = 'employeeRepository';
        break;
      default:
        throw new Error(ERRORS.invalid_user_type);
    }

    return this.usersService.disableUser(disableUserInput.uuid, repository);
  }
}
