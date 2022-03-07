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
import { DeleteResult, UpdateResult } from 'typeorm';
import { string } from 'joi';
import { DeleteProjectInput } from './dto/input/delete-project.input';

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
    if (await this.validateAccessToProject(user, getProjectDevicesArgs.name)) {
      return this.projectService.getProjectDevices(getProjectDevicesArgs);
    }
  }

  /**
   * Create a new project for the given user
   * @param {CreateProjectInput} createProjectInput - Input containing project name and associatied MR2000 and MR3000 devices
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
   * @param {string} projectUuid - Uuid of the project to change
   * @param {string} projectName - Project name before the update
   * @param {UpdateProjectInput} updateProjectInput - Input containing the new project name
   * @param {Record<string, string>} user - currently logged-in user from request
   * @return {Promise<Project>} - The newly created project
   */
  @AnyRole()
  @Mutation(() => Project)
  async updateProjectName(
    @Args({ name: 'projectUuid', type: () => String })
    projectUuid: string,
    @Args({ name: 'projectName', type: () => String })
    projectName: string,
    @Args({ name: 'updateProjectInput', type: () => UpdateProjectInput })
    updateProjectInput: UpdateProjectInput,
    @CurrentUser() user: Record<string, string>,
  ): Promise<UpdateResult> {
    if (await this.validateAccessToProject(user, projectName)) {
      return this.projectService.updateProjectName(
        projectUuid,
        updateProjectInput,
      );
    }
  }

  /**
   * Deletes a project
   * @param {DeleteProjectInput} deleteProjectInput - Input that contains the uuid and name of the project to delete.
   * @param {Record<string, string>} user - User who requested the deletion.
   * @return {DeleteResult} - Result object from deletion
   */
  async deleteProject(
    @Args({ name: 'deleteProjectInput', type: () => DeleteProjectInput })
    deleteProjectInput: DeleteProjectInput,
    @CurrentUser() user: Record<string, string>,
  ): Promise<DeleteResult> {
    if (await this.validateAccessToProject(user, deleteProjectInput.name)) {
      return this.projectService.deleteProject(deleteProjectInput);
    }
  }

  /**
   * Validates if the given user has access to the given project
   * @param {Record<string, string>} user - User that demands access
   * @param {string} projectName - Project which user wants to access
   * @private
   * @return {boolean} - validation result
   */
  private async validateAccessToProject(
    user: Record<string, string>,
    projectName: string,
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
      !dbUser.projects.some((project) => project.name === projectName)
    ) {
      throw new Error(ERRORS.resource_not_allowed);
    }
    return true;
  }
}
