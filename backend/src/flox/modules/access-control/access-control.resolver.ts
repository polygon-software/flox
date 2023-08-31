import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { LoggedIn } from '../auth/authentication.decorator';
import GetOneArgs from '../abstracts/crud/dto/args/get-one.args';
import GetMultipleArgs from '../abstracts/crud/dto/args/get-multiple.args';
import GetAllArgs from '../abstracts/crud/dto/args/get-all.args';
import { AdminOnly, CurrentUser } from '../roles/authorization.decorator';
import User from '../auth/entities/user.entity';
import DeleteInput from '../abstracts/crud/dto/input/delete.input';
import UserService from '../auth/user.service';
import AbstractSearchResolver from '../abstracts/search/abstract-search.resolver';
import SearchArgs from '../abstracts/search/dto/args/search.args';

import UserGroup from './entities/user-group.entity';
import AccessControlService from './access-control.service';
import GetAllOfUserArgs from './dto/args/get-all-of-user.args';
import CreateUserGroupInput from './dto/input/create-user-group.input';
import UpdateUserGroupInput from './dto/input/update-user-group.input';
import AddUserToUserGroupInput from './dto/input/add-user-to-user-group-input';
import RemoveUserFromUserGroupInput from './dto/input/remove-user-from-user-group.input';
import UserGroupSearchOutput from './dto/output/user-group-search.output';
import AddUsersToUserGroupInput from './dto/input/add-users-to-user-group.input';

@Resolver(() => UserGroup)
export default class AccessControlResolver extends AbstractSearchResolver<
  UserGroup,
  AccessControlService
> {
  constructor(
    protected readonly accessControlService: AccessControlService,
    private readonly userService: UserService,
  ) {
    super(['name']);
  }

  /**
   * @returns access control service
   */
  get service(): AccessControlService {
    return this.accessControlService;
  }

  /**
   * Retrieves a user group
   *
   * @param getOneArgs - contains uuid of user group
   * @returns user group
   */
  @LoggedIn()
  @Query(() => UserGroup, { name: 'UserGroup' })
  async getUserGroup(@Args() getOneArgs: GetOneArgs): Promise<UserGroup> {
    return super.getOne(getOneArgs, { relations: { users: true } });
  }

  /**
   * Retrieves all user groups in which a provided user is part of
   *
   * @param getAllOfUserArgs - contains uuid of user for which groups shall be retrieved
   * @returns list of user groups
   */
  @AdminOnly()
  @Query(() => [UserGroup], { name: 'UserGroupsOfUser' })
  async getUserGroupsOfUser(
    @Args() getAllOfUserArgs: GetAllOfUserArgs,
  ): Promise<UserGroup[]> {
    return this.accessControlService.getUserGroupsForUser(
      getAllOfUserArgs.userUuid,
      getAllOfUserArgs,
    );
  }

  /**
   * Retrieves user groups of the logged in user
   *
   * @param getAll - contains skip and take info for pagination
   * @param user - logged in user
   * @returns list of user groups
   */
  @LoggedIn()
  @Query(() => [UserGroup], { name: 'MyUserGroups' })
  async getMyUserGroups(
    @Args() getAll: GetAllArgs,
    @CurrentUser() user: User,
  ): Promise<UserGroup[]> {
    return this.accessControlService.getUserGroupsForUser(user.uuid, getAll);
  }

  /**
   * Retrieves multiple user groups explicitely specified by their uuid
   *
   * @param getMultipleArgs - contains a list of uuids of the user groups to retrieve
   * @returns the list of found user groups
   */
  @LoggedIn()
  @Query(() => [UserGroup], { name: 'UserGroups' })
  async getUserGroups(
    @Args() getMultipleArgs: GetMultipleArgs,
  ): Promise<UserGroup[]> {
    return super.getMultiple(getMultipleArgs, { relations: { users: true } });
  }

  /**
   * Retrieves all user groups from a database with applying pagination
   *
   * @param getAllArgs - contains pagination parameters (skip, take)
   * @returns page of user groups
   */
  @AdminOnly()
  @Query(() => [UserGroup], { name: 'AllUserGroups' })
  async getAllUserGroups(@Args() getAllArgs: GetAllArgs): Promise<UserGroup[]> {
    return super.getAll(getAllArgs, { relations: { users: true } });
  }

  /**
   * Queries for all user groups that fit query criteria, best used in combination with the DataTable
   *
   * @param searchQueryArgs - contain table filtering rules
   * @returns user groups that fit criteria
   */
  @AdminOnly()
  @Query(() => UserGroupSearchOutput, { name: 'SearchUserGroups' })
  async searchUserGroups(
    @Args() searchQueryArgs: SearchArgs,
  ): Promise<UserGroupSearchOutput> {
    return super.search(searchQueryArgs, { relations: { users: true } });
  }

  /**
   * Creates a new user group based on the create input
   *
   * @param createUserGroupInput - specifications of user group
   * @returns the created user group
   */
  @AdminOnly()
  @Mutation(() => UserGroup, { name: 'CreateUserGroup' })
  async createUserGroup(
    @Args('createUserGroupInput') createUserGroupInput: CreateUserGroupInput,
  ): Promise<UserGroup> {
    const created = await super.create({
      name: createUserGroupInput.name,
      users: createUserGroupInput.users.map((uuid) => ({ uuid })),
    });
    await this.accessControlService.addUsersToUserGroup(
      created.uuid,
      createUserGroupInput.users,
    );
    return this.getOne({ uuid: created.uuid }, { relations: { users: true } });
  }

  /**
   * Updates an existing user group within the database according to the update input
   *
   * @param updateUserGroupInput - specification of update
   * @returns the updated user group, freshly retrieved from the database
   */
  @AdminOnly()
  @Mutation(() => UserGroup, { name: 'UpdateUserGroup' })
  async updateUserGroup(
    @Args('updateUserGroupInput') updateUserGroupInput: UpdateUserGroupInput,
  ): Promise<UserGroup> {
    return super.update(updateUserGroupInput, { relations: { users: true } });
  }

  /**
   * Removes a user group from the database
   *
   * @param deleteInput - contains the uuid of the user group to remove
   * @returns the deleted user group
   */
  @AdminOnly()
  @Mutation(() => UserGroup, { name: 'DeleteUserGroup' })
  async deleteUserGroup(
    @Args('deleteInput') deleteInput: DeleteInput,
  ): Promise<UserGroup> {
    return super.delete(deleteInput);
  }

  /**
   * Adds the provided user to a user group
   *
   * @param addUserToUserGroupInput - contains uuid of user and uer group
   * @returns User group including the newly added user
   */
  @AdminOnly()
  @Mutation(() => UserGroup, { name: 'AddUserToUserGroup' })
  async addUserToUserGroup(
    @Args('addUserToUserGroupInput')
    addUserToUserGroupInput: AddUserToUserGroupInput,
  ): Promise<UserGroup> {
    const user = await this.userService.getUser({
      uuid: addUserToUserGroupInput.userUuid,
    });
    return this.accessControlService.addUserToUserGroup(
      addUserToUserGroupInput.userGroupUuid,
      user,
    );
  }

  /**
   * Add multiple users to a user group
   *
   * @param addUsersToUserGroupInput - contains uuid of users and uer group
   * @returns User group including the newly added users
   */
  @AdminOnly()
  @Mutation(() => UserGroup, { name: 'AddUsersToUserGroup' })
  async addUsersToUserGroup(
    @Args('addUsersToUserGroupInput')
    addUsersToUserGroupInput: AddUsersToUserGroupInput,
  ): Promise<UserGroup> {
    return this.accessControlService.addUsersToUserGroup(
      addUsersToUserGroupInput.userGroupUuid,
      addUsersToUserGroupInput.userUuids,
    );
  }

  /**
   * Removes the provided user from a user group
   *
   * @param removeUserFromUserGroupInput - contains uuid of user and user group
   * @returns User group without the removed user
   */
  @AdminOnly()
  @Mutation(() => UserGroup, { name: 'RemoveUserFromUserGroup' })
  async removeUserFromGroup(
    @Args('removeUserFromUserGroupInput')
    removeUserFromUserGroupInput: RemoveUserFromUserGroupInput,
  ): Promise<UserGroup> {
    const user = await this.userService.getUser({
      uuid: removeUserFromUserGroupInput.userUuid,
    });
    return this.accessControlService.removeUserFromGroup(
      removeUserFromUserGroupInput.userGroupUuid,
      user,
    );
  }
}
