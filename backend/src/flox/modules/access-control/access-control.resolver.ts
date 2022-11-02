import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import AbstractCrudResolver from '../abstracts/crud/abstract-crud.resolver';
import { LoggedIn } from '../auth/authentication.decorator';
import GetOneArgs from '../abstracts/crud/dto/get-one.args';
import GetMultipleArgs from '../abstracts/crud/dto/get-multiple.args';
import GetAllArgs from '../abstracts/crud/dto/get-all.args';
import { AdminOnly, CurrentUser } from '../roles/authorization.decorator';
import User from '../auth/entities/user.entity';
import DeleteInput from '../abstracts/crud/inputs/delete.input';
import UserService from '../auth/user.service';

import UserGroup from './entities/user-group.entity';
import AccessControlService from './access-control.service';
import GetAllOfUserArgs from './dto/args/get-all-of-user.args';
import CreateUserGroupInput from './dto/inputs/create-user-group.input';
import UpdateUserGroupInput from './dto/inputs/update-user-group.input';
import AddUserToUserGroupInput from './dto/inputs/add-user-to-user-group-input';
import RemoveUserFromUserGroupInput from './dto/inputs/remove-user-from-user-group.input';

@Resolver(() => UserGroup)
export default class AccessControlResolver extends AbstractCrudResolver<
  UserGroup,
  AccessControlService
> {
  constructor(
    protected readonly accessControlService: AccessControlService,
    private readonly userService: UserService,
  ) {
    super();
  }

  get service(): AccessControlService {
    return this.accessControlService;
  }

  @LoggedIn()
  @Query(() => UserGroup, { name: 'UserGroup' })
  async getUserGroup(@Args() getOneArgs: GetOneArgs): Promise<UserGroup> {
    return super.getOne(getOneArgs);
  }

  @LoggedIn()
  @Query(() => [UserGroup], { name: 'UserGroupsOfUser' })
  async getUserGroupsOfUser(
    @Args() getAllOfUserArgs: GetAllOfUserArgs,
    @CurrentUser() user: User,
  ): Promise<UserGroup[]> {
    return this.accessControlService.getUserGroupsForUser(user);
  }

  @LoggedIn()
  @Query(() => [UserGroup], { name: 'UserGroups' })
  async getUserGroups(
    @Args() getMultipleArgs: GetMultipleArgs,
  ): Promise<UserGroup[]> {
    return super.getMultiple(getMultipleArgs);
  }

  @LoggedIn()
  @Query(() => [UserGroup], { name: 'AllGroups' })
  async getAllUserGroups(@Args() getAllArgs: GetAllArgs): Promise<UserGroup[]> {
    return super.getAll(getAllArgs);
  }

  @AdminOnly()
  @Mutation(() => UserGroup, { name: 'CreateUserGroup' })
  async createUserGroup(
    @Args('createUserGroupInput') createUserGroupInput: CreateUserGroupInput,
  ): Promise<UserGroup> {
    return super.create(createUserGroupInput);
  }

  @AdminOnly()
  @Mutation(() => UserGroup, { name: 'UpdateUserGroup' })
  async updateUserGroup(
    @Args('updateUserGroupInput') updateUserGroupInput: UpdateUserGroupInput,
  ): Promise<UserGroup> {
    return super.update(updateUserGroupInput);
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
