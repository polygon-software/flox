import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { GetUserArgs } from './dto/args/get-user.args';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { User } from './entities/user.entity';
import { Public } from '../../auth/authentication.decorator';
import {
  AdminOnly,
  AnyRole,
  CurrentUser,
} from '../../auth/authorization.decorator';
import { AddUserPermissionInput } from './dto/input/add-user-permission.input';
import { Project } from '../../types/Project';
import { Device } from '../../types/Device';
import { GetProjectDevicesArgs } from '../device/dto/args/get-project-devices.args';
import { RegisterUserInput } from './dto/input/register-user.input';
import { GetUserProjectsArgs } from '../project/dto/args/get-user-projects.args';
import { GetUserDevicesArgs } from '../device/dto/args/get-user-devices.args';
import { ROLE } from '../../ENUM/ENUM';
import { ERRORS } from '../../error/ERRORS';
import { GetMyDevicesArgs } from '../device/dto/args/get-my-devices.args';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @AdminOnly()
  @Query(() => [User], { name: 'allUsers' })
  async getAllPartners(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @AdminOnly()
  @Query(() => User, { name: 'user' })
  async getUser(@Args() getUserArgs: GetUserArgs): Promise<User> {
    return this.usersService.getUser(getUserArgs);
  }

  @Public()
  @Query(() => Boolean, { name: 'isEmailAllowed' })
  async getUserAllowed(@Args('email') email: string): Promise<boolean> {
    return this.usersService.existsUserWithEmail(email);
  }

  @Public()
  @Mutation(() => User, { name: 'register', nullable: true })
  async register(
    @Args('registerUserInput') registerUserInput: RegisterUserInput,
  ): Promise<User> {
    return this.usersService.register(registerUserInput);
  }

  @AdminOnly()
  @Mutation(() => User, { name: 'create' })
  async create(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @AdminOnly()
  @Mutation(() => User)
  async update(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update(updateUserInput);
  }

  @AdminOnly()
  @Mutation(() => User)
  async remove(
    @Args('deleteUserInput') deleteUserInput: DeleteUserInput,
  ): Promise<User> {
    return this.usersService.remove(deleteUserInput);
  }

  /**
   * Get the DB user for the currently logged in cognito user
   * @param {Record<string, string>}  user - currently logged-in user from request
   * @returns {Promise<User>} - the user, if any
   */
  @AnyRole()
  @Query(() => User, { name: 'myUser' })
  async myUser(@CurrentUser() user: Record<string, string>): Promise<User> {
    // Get user where user's UUID matches cognitoID
    const myUser = await this.usersService.fetchUserByCognitoUuid(user.userId);

    if (!myUser) {
      throw new Error(`No user found for ${user.userId}`);
    }
    return myUser;
  }

  /**
   * Grants a user access to an instance (MR2000, MR3000 or project)
   * @param {AddUserPermissionInput} addUserPermissionInput - input, containing user uuid, resource name and type
   * @returns {Promise<User>} - the updated user
   */
  @AdminOnly()
  @Mutation(() => User, { name: 'addPermission' })
  async addPermission(
    @Args('addUserPermissionInput')
    addUserPermissionInput: AddUserPermissionInput,
  ): Promise<User> {
    return this.usersService.addPermission(addUserPermissionInput);
  }

  /**
   * Returns a list of a given user's MR2000 & MR3000 devices
   * @param {GetUserDevicesArgs} getUserDevicesArgs - contains user's UUID
   * @returns {Promise<Device[]>} - the user's devices
   */
  @AdminOnly()
  @Query(() => [Device], { name: 'getUserDevices' })
  async getUserDevices(@Args() getUserDevicesArgs: GetUserDevicesArgs) {
    return this.usersService.getUserDevices(getUserDevicesArgs);
  }

  /**
   * Returns a list of the current user's devices
   * @param {Record<string, string>}  user - currently logged-in user from request
   * @param {GetMyDevicesArgs} [getMyDevicesArgs] - arguments containing whether to return only unassigned devices
   * @returns {Promise<Project[]>} - the user's projects
   */
  @AnyRole()
  @Query(() => [Device], { name: 'myDevices' })
  async myDevices(
    @CurrentUser() user: Record<string, string>,
    @Args() getMyDevicesArgs?: GetMyDevicesArgs,
  ) {
    // Get user
    const dbUser = await this.usersService.getUser({
      cognitoUuid: user.userId,
    } as GetUserArgs);

    if (!dbUser) {
      throw new Error(`No user found for ${user.userId}`);
    }
    return this.usersService.getUserDevices({
      uuid: dbUser.uuid,
      unassigned: getMyDevicesArgs?.unassigned ?? false,
    } as GetUserDevicesArgs);
  }
}
