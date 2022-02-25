import { Args, Query, Resolver } from '@nestjs/graphql';

import { ProjectService } from './project.service';
import { User } from '../user/entities/user.entity';
import {
  AdminOnly,
  AnyRole,
  CurrentUser,
} from '../../auth/authorization.decorator';
import { Project } from '../../types/Project';
import { GetUserArgs } from '../user/dto/args/get-user.args';
import { UserService } from '../user/user.service';
import { Device } from '../../types/Device';
import { GetProjectDevicesArgs } from '../device/dto/args/get-project-devices.args';
import { ROLE } from '../../ENUM/ENUM';
import { ERRORS } from '../../error/ERRORS';
import { GetUserProjectsArgs } from './dto/args/get-user-projects.args';

@Resolver(() => User)
export class ProjectResolver {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  /**
   * Returns a list of a given user's projects
   * @param {GetUserProjectsArgs} getUserProjectsArgs - contains user's UUID
   * @returns {Promise<Project[]>} - the user's projects
   */
  @AdminOnly()
  @Query(() => [Project], { name: 'getUserProjects' })
  async getUserProjects(@Args() getUserProjectsArgs: GetUserProjectsArgs) {
    return this.projectService.getUserProjects(getUserProjectsArgs);
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
    const dbUser = await this.userService.getUser({
      cognitoUuid: user.userId,
    } as GetUserArgs);

    if (!dbUser) {
      throw new Error(`No user found for ${user.userId}`);
    }
    return this.projectService.getUserProjects({ uuid: dbUser.uuid });
  }

  /**
   * Returns a list of the devices (MR2000 or MR3000) belonging to a given project
   * @param {GetProjectDevicesArgs} getProjectDevicesArgs - getter arguments, containing project name
   * @param {Record<string, string>} user - currently logged-in user from request
   * @returns {Promise<Device[]>} - the project's devices
   */
  @AnyRole()
  @Query(() => [Device], { name: 'getProjectDevices' })
  async getProjectDevices(
    @Args() getProjectDevicesArgs: GetProjectDevicesArgs,
    @CurrentUser() user: Record<string, string>,
  ) {
    // Get user
    const dbUser = await this.userService.getUser({
      cognitoUuid: user.userId,
    } as GetUserArgs);

    if (!dbUser) {
      throw new Error(`No user found for ${user.userId}`);
    }
    // For non-admin users, check whether they have permissions to access the requested project
    if (
      dbUser.role !== ROLE.ADMIN &&
      !dbUser.projects.includes(getProjectDevicesArgs.name)
    ) {
      throw new Error(ERRORS.resource_not_allowed);
    }

    return this.projectService.getProjectDevices(getProjectDevicesArgs);
  }
}
