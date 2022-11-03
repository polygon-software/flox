import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { LoggedIn } from '../auth/authentication.decorator';
import GetOneArgs from '../abstracts/crud/dto/get-one.args';
import GetMultipleArgs from '../abstracts/crud/dto/get-multiple.args';
import GetAllArgs from '../abstracts/crud/dto/get-all.args';
import { AdminOnly, CurrentUser } from '../roles/authorization.decorator';
import User from '../auth/entities/user.entity';
import DeleteInput from '../abstracts/crud/inputs/delete.input';
import UserService from '../auth/user.service';
import AbstractSearchResolver from '../abstracts/search/abstract-search.resolver';
import SearchArgs from '../abstracts/search/dto/args/search.args';

import UserGroup from './entities/user-group.entity';
import AccessControlService from './access-control.service';
import GetAllOfUserArgs from './dto/args/get-all-of-user.args';
import CreateUserGroupInput from './dto/inputs/create-user-group.input';
import UpdateUserGroupInput from './dto/inputs/update-user-group.input';
import AddUserToUserGroupInput from './dto/inputs/add-user-to-user-group-input';
import RemoveUserFromUserGroupInput from './dto/inputs/remove-user-from-user-group.input';
import UserGroupSearchOutput from './outputs/user-group-search.output';

@Resolver(() => UserGroup)
export default class AccessControlResolver extends AbstractSearchResolver<
  UserGroup,
  AccessControlService
> {
  constructor(
    protected readonly accessControlService: AccessControlService,
    private readonly userService: UserService,
  ) {
    super('name');
  }

  get service(): AccessControlService {
    return this.accessControlService;
  }

  @LoggedIn()
  @Query(() => UserGroup, { name: 'UserGroup' })
  async getUserGroup(@Args() getOneArgs: GetOneArgs): Promise<UserGroup> {
    return super.getOne(getOneArgs, { relations: { users: true } });
  }

  @LoggedIn()
  @Query(() => [UserGroup], { name: 'UserGroupsOfUser' })
  async getUserGroupsOfUser(
    @Args() getAllOfUserArgs: GetAllOfUserArgs,
  ): Promise<UserGroup[]> {
    return this.accessControlService.getUserGroupsForUser(
      getAllOfUserArgs.userUuid,
      getAllOfUserArgs,
    );
  }

  @LoggedIn()
  @Query(() => [UserGroup], { name: 'MyUserGroups' })
  async getMyUserGroups(
    @Args() getAll: GetAllArgs,
    @CurrentUser() user: User,
  ): Promise<UserGroup[]> {
    return this.accessControlService.getUserGroupsForUser(user.uuid, getAll);
  }

  @LoggedIn()
  @Query(() => [UserGroup], { name: 'UserGroups' })
  async getUserGroups(
    @Args() getMultipleArgs: GetMultipleArgs,
  ): Promise<UserGroup[]> {
    return super.getMultiple(getMultipleArgs, { relations: { users: true } });
  }

  @LoggedIn()
  @Query(() => [UserGroup], { name: 'AllUserGroups' })
  async getAllUserGroups(@Args() getAllArgs: GetAllArgs): Promise<UserGroup[]> {
    return super.getAll(getAllArgs, { relations: { users: true } });
  }

  @LoggedIn()
  @Query(() => UserGroupSearchOutput, { name: 'SearchUserGroups' })
  async searchUserGroups(
    @Args() searchQueryArgs: SearchArgs,
  ): Promise<UserGroupSearchOutput> {
    return super.search(searchQueryArgs, { relations: { users: true } });
  }

  @AdminOnly()
  @Mutation(() => UserGroup, { name: 'CreateUserGroup' })
  async createUserGroup(
    @Args('createUserGroupInput') createUserGroupInput: CreateUserGroupInput,
  ): Promise<UserGroup> {
    const created = await super.create(createUserGroupInput);
    const userAdditionPromises = createUserGroupInput?.users.map((userUuid) => {
      return this.addUserToUserGroup({
        userUuid,
        userGroupUuid: created.uuid,
      });
    });
    await Promise.all(userAdditionPromises);
    return this.getOne({ uuid: created.uuid }, { relations: { users: true } });
  }

  @AdminOnly()
  @Mutation(() => UserGroup, { name: 'UpdateUserGroup' })
  async updateUserGroup(
    @Args('updateUserGroupInput') updateUserGroupInput: UpdateUserGroupInput,
  ): Promise<UserGroup> {
    return super.update(updateUserGroupInput, { relations: { users: true } });
  }

  @AdminOnly()
  @Mutation(() => UserGroup, { name: 'DeleteUserGroup' })
  async deleteUserGroup(
    @Args('deleteInput') deleteInput: DeleteInput,
  ): Promise<UserGroup> {
    return super.delete(deleteInput);
  }

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
