import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
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
import { GetProjectDevicesArgs } from './dto/args/get-project-devices.args';
import { RegisterUserInput } from './dto/input/register-user.input';
import { GetUserProjectsArgs } from './dto/args/get-user-projects.args';
import { GetUserDevicesArgs } from './dto/args/get-user-devices.args';

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
   * Returns a list of a given user's projects
   * @param {GetUserProjectsArgs} getUserProjectsArgs - contains user's UUID
   * @returns {Promise<Project[]>} - the user's projects
   */
  @AdminOnly()
  @Query(() => [Project], { name: 'getUserProjects' })
  async getUserProjects(@Args() getUserProjectsArgs: GetUserProjectsArgs) {
    return this.usersService.getUserProjects(getUserProjectsArgs);
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
   * Returns a list of the current user's projects
   * @param {Record<string, string>}  user - currently logged-in user from request
   * @returns {Promise<Project[]>} - the user's projects
   */
  @AnyRole()
  @Query(() => [Project], { name: 'myProjects' })
  async myProjects(@CurrentUser() user: Record<string, string>) {
    // Get user
    const dbUser = await this.usersService.getUser({
      cognitoUuid: user.userId,
    } as GetUserArgs);

    if (!dbUser) {
      throw new Error(`No user found for ${user.userId}`);
    }
    return this.usersService.getUserProjects({ uuid: dbUser.uuid });
  }

  /**
   * Returns a list of the current user's devices
   * @param {Record<string, string>}  user - currently logged-in user from request
   * @returns {Promise<Project[]>} - the user's projects
   */
  @AnyRole()
  @Query(() => [Device], { name: 'myDevices' })
  async myDevices(@CurrentUser() user: Record<string, string>) {
    // Get user
    const dbUser = await this.usersService.getUser({
      uuid: user.userId,
    } as GetUserArgs);

    if (!dbUser) {
      throw new Error(`No user found for ${user.userId}`);
    }
    return this.usersService.getUserDevices({ uuid: dbUser.uuid });
  }

  @AnyRole()
  @Query(() => [Device], { name: 'getProjectDevices' })
  async getProjectDevices(
    @Args() getProjectDevicesArgs: GetProjectDevicesArgs,
  ) {
    // TODO permission check on user for non-admin
    return this.usersService.getProjectDevices(getProjectDevicesArgs);
  }
}
