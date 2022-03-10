import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import {
  AdminOnly,
  AnyRole,
  CurrentUser,
} from '../../auth/authorization.decorator';
import { Project } from './entities/project.entity';
import { GetUserArgs } from '../user/dto/args/get-user.args';
import { UserService } from '../user/user.service';
import { Device } from '../../types/Device';
import { GetProjectDevicesArgs } from '../device/dto/args/get-project-devices.args';
import { ROLE } from '../../ENUM/ENUM';
import { ERRORS } from '../../error/ERRORS';
import { GetUserProjectsArgs } from './dto/args/get-user-projects.args';
import { CreateProjectInput } from './dto/input/create-project.input';
import { UpdateProjectInput } from './dto/input/update-project-input';
import { DeleteProjectInput } from './dto/input/delete-project.input';
import { RemoveDeviceFromProjectInput } from './dto/input/remove-device-from-project.input';
import { AssignDeviceToProjectInput } from './dto/input/assign-device-to-project.input';
import { UnauthorizedException } from '@nestjs/common';

@Resolver(() => Project)
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
    // Determine if a project name was given, we need to ensure matching project for the user
    if (getProjectDevicesArgs.name) {
      // Get user
      const dbUser = await this.userService.getUser({
        cognitoUuid: user.userId,
      } as GetUserArgs);

      if (!dbUser) {
        throw new Error(`No user found for ${user.userId}`);
      }
      const userProjects = await this.projectService.getUserProjects({
        uuid: dbUser.uuid,
      });

      const project = userProjects.find(
        (userProject) => userProject.name === getProjectDevicesArgs.name,
      );

      if (!project) {
        throw new Error(
          `No project named ${getProjectDevicesArgs.name} found for user`,
        );
      }

      return this.projectService.getProjectDevices({
        uuid: project.uuid,
      } as GetProjectDevicesArgs);
    } else if (
      await this.validateAccessToProject(user, getProjectDevicesArgs.uuid)
    ) {
      return this.projectService.getProjectDevices(getProjectDevicesArgs);
    }
    throw new UnauthorizedException();
  }

  /**
   * Removes a device from a given project
   * @param {RemoveDeviceFromProjectInput} removeDeviceFromProjectInput - contains project UUID & device CLI
   * @param {Record<string, string>} user - currently logged-in user from request
   * @returns {Promise<Project>} - the updated project
   */
  @AnyRole()
  @Mutation(() => Project)
  async removeDeviceFromProject(
    @Args({
      name: 'removeDeviceFromProjectInput',
      type: () => RemoveDeviceFromProjectInput,
    })
    removeDeviceFromProjectInput: RemoveDeviceFromProjectInput,
    @CurrentUser() user: Record<string, string>,
  ) {
    if (
      await this.projectService.validateAccessToProject(
        user,
        removeDeviceFromProjectInput.uuid,
      )
    ) {
      return this.projectService.removeDeviceFromProject(
        removeDeviceFromProjectInput,
      );
    }
    throw new UnauthorizedException();
  }

  /**
   * Create a new project for the given user
   * @param {CreateProjectInput} createProjectInput - Input containing project name and associated MR2000 and MR3000 devices
   * @return {Project} - The newly created project
   */
  @AnyRole()
  @Mutation(() => Project)
  async createProject(
    @Args({ name: 'createProjectInput', type: () => CreateProjectInput })
    createProjectInput: CreateProjectInput,
  ): Promise<Project> {
    return this.projectService.createProject(createProjectInput);
  }

  /**
   * Update a project
   * @param {UpdateProjectInput} updateProjectInput - Input containing the new project name
   * @param {Record<string, string>} user - currently logged-in user from request
   * @return {Promise<Project>} - The newly created project
   */
  @AnyRole()
  @Mutation(() => Project)
  async updateProjectName(
    @Args({ name: 'updateProjectInput', type: () => UpdateProjectInput })
    updateProjectInput: UpdateProjectInput,
    @CurrentUser() user: Record<string, string>,
  ) {
    if (await this.validateAccessToProject(user, updateProjectInput.uuid)) {
      // Get user
      const dbUser = await this.userService.getUser({
        cognitoUuid: user.userId,
      } as GetUserArgs);

      return this.projectService.updateProjectName(
        updateProjectInput,
        dbUser.uuid,
      );
    }
    throw new UnauthorizedException();
  }

  /**
   * Deletes a project
   * @param {DeleteProjectInput} deleteProjectInput - Input that contains the uuid of the project to delete.
   * @param {Record<string, string>} user - User who requested the deletion.
   * @return {Promise<Project>} - The project that was deleted
   */
  @AnyRole()
  @Mutation(() => Project)
  async deleteProject(
    @Args({ name: 'deleteProjectInput', type: () => DeleteProjectInput })
    deleteProjectInput: DeleteProjectInput,
    @CurrentUser() user: Record<string, string>,
  ) {
    if (await this.projectService.validateAccessToProject(user, deleteProjectInput.uuid)) {
      return this.projectService.deleteProject(deleteProjectInput);
    }
    throw new UnauthorizedException();
  }

  /**
   * Validates if the given user has access to the given project
   * @param {Record<string, string>} user - User that demands access
   * @param {string} projectUuid - UUID of the project which the user wants to access
   * @private
   * @return {boolean} - validation result
   */
  private async validateAccessToProject(
    user: Record<string, string>,
    projectUuid: string,
  ): Promise<boolean> {
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
      !dbUser.projects.some((project) => project.uuid === projectUuid)
    ) {
      throw new Error(ERRORS.resource_not_allowed);
    }
    return true;
  }

  /**
   * Validates if the given user has access to the given device
   * @param {Record<string, string>} user - User that demands access
   * @param {string} cli - CLI of the device which the user wants to access
   * @private
   * @return {boolean} - validation result
   */
  private async validateAccessToDevice(
    user: Record<string, string>,
    cli: string,
  ): Promise<boolean> {
    // Get user
    const dbUser = await this.userService.getUser({
      cognitoUuid: user.userId,
    } as GetUserArgs);

    if (!dbUser) {
      throw new Error(`No user found for ${user.userId}`);
    }
    // For non-admin users, check whether they have permissions to access the requested device
    if (
      dbUser.role !== ROLE.ADMIN &&
      !dbUser.mr2000instances.some((device) => device === cli) &&
      !dbUser.mr3000instances.some((device) => device === cli)
    ) {
      throw new Error(ERRORS.resource_not_allowed);
    }
    return true;
  }

  /**
   * Assigns a given device to a project
   * @param {AssignDeviceToProjectInput} assignDeviceToProjectInput - contains project UUID & device CLI
   * @param {Record<string, string>} user - currently logged-in user from request
   * @returns {Promise<Project>} - the updated project
   */
  @AnyRole()
  @Mutation(() => Project)
  async assignDeviceToProject(
    @Args({
      name: 'assignDeviceToProjectInput',
      type: () => AssignDeviceToProjectInput,
    })
    assignDeviceToProjectInput: AssignDeviceToProjectInput,
    @CurrentUser() user: Record<string, string>,
  ) {
    // Verify project access
    const hasProjectAccess = await this.validateAccessToProject(
      user,
      assignDeviceToProjectInput.uuid,
    );

    // Verify device access
    const hasDeviceAccess = await this.validateAccessToDevice(
      user,
      assignDeviceToProjectInput.cli,
    );

    if (hasProjectAccess && hasDeviceAccess) {
      return this.projectService.assignDeviceToProject(
        assignDeviceToProjectInput,
      );
    }

    throw new UnauthorizedException();
  }
}
