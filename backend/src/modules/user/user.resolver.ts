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
import { RegisterUserInput } from './dto/input/register-user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @AdminOnly()
  @Query(() => [User], { name: 'allUsers' })
  async getAllPartners(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @AdminOnly()
  @Query(() => User, { name: 'user' })
  async getUser(@Args() getUserArgs: GetUserArgs): Promise<User> {
    return this.userService.getUser(getUserArgs);
  }

  @Public()
  @Query(() => Boolean, { name: 'isEmailAllowed' })
  async getUserAllowed(@Args('email') email: string): Promise<boolean> {
    return this.userService.existsUserWithEmail(email);
  }

  @Public()
  @Mutation(() => User, { name: 'register', nullable: true })
  async register(
    @Args('registerUserInput') registerUserInput: RegisterUserInput,
  ): Promise<User> {
    return this.userService.register(registerUserInput);
  }

  @AdminOnly()
  @Mutation(() => User, { name: 'create' })
  async create(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.userService.create(createUserInput);
  }

  @AdminOnly()
  @Mutation(() => User)
  async update(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.userService.update(updateUserInput);
  }

  @AdminOnly()
  @Mutation(() => User)
  async remove(
    @Args('deleteUserInput') deleteUserInput: DeleteUserInput,
  ): Promise<User> {
    return this.userService.remove(deleteUserInput);
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
    const myUser = await this.userService.fetchUserByCognitoUuid(user.userId);

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
    return this.userService.addPermission(addUserPermissionInput);
  }
}
