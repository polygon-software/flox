import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { GetProjectDevicesArgs } from '../device/dto/args/get-project-devices.args';
import { removeDeviceFromProject } from '../../helpers/device-helpers';
import { GetUserProjectsArgs } from './dto/args/get-user-projects.args';
import { CreateProjectInput } from './dto/input/create-project.input';
import { RemoveDevicesFromProjectInput } from './dto/input/remove-devices-from-project.input';
import { Project } from './entities/project.entity';
import { UpdateProjectInput } from './dto/input/update-project-input';
import { DeleteProjectInput } from './dto/input/delete-project.input';
import { GetUserArgs } from '../user/dto/args/get-user.args';
import { ROLE } from '../../ENUM/ENUM';
import { ERRORS } from '../../error/ERRORS';
import { UserService } from '../user/user.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}

  /**
   * Returns a list the devices belonging to a given project
   * @param {GetProjectDevicesArgs} getProjectDevicesArgs - contains project uuid
   * @returns {Promise<MR2000|MR3000[]>} - the user's devices
   */
  async getProjectDevices(getProjectDevicesArgs: GetProjectDevicesArgs) {
    // TODO functionality
  }

  /**
   * Returns a list of the user's projects
   * @param {GetUserProjectsArgs} getUserProjectsArgs - contains user's UUID
   * @returns {Promise<Project[]>} - the user's projects
   */
  async getUserProjects(getUserProjectsArgs: GetUserProjectsArgs) {
    // Get user
    const user = await this.userRepository.findOne(getUserProjectsArgs.uuid);

    if (!user) {
      throw new Error(`No user found for ${getUserProjectsArgs.uuid}`);
    }

    return this.projectRepository.find({
      user: user,
    });
  }

  /**
   * Creates a new project
   * @param {CreateProjectInput} createProjectInput - contains the owners uuid, as well as project name & associated MR2000/3000 instances
   * @returns {Promise<Project>} - the newly created project
   */
  async createProject(createProjectInput: CreateProjectInput) {
    const projectName = createProjectInput.name;
    const userUuid = createProjectInput.userUuid;
    const user = await this.userRepository.findOne(userUuid);

    // Ensure project name is not already present (in actual projects and/or permissions)
    const userProjects = await this.getUserProjects({ uuid: userUuid });
    const userProjectPermissions = user.projects;

    if (
      userProjectPermissions.find((project) => project.name === projectName) ||
      userProjects.find((project) => project.name === projectName)
    ) {
      throw new Error(`Project name ${projectName} is already taken`);
    }

    // Create new project
    const newProject = this.projectRepository.create({
      name: createProjectInput.name,
      user: user,
      mr2000instances: createProjectInput.mr2000instances,
      mr3000instances: createProjectInput.mr3000instances,
    });
    await this.projectRepository.save(newProject);

    return newProject;
  }

  /**
   * Updates a project
   * @param {UpdateProjectInput} updateProjectInput Project parameters that should be changed.
   * @return {UpdateProjectInput} - The updated project
   */
  async updateProjectName(
    updateProjectInput: UpdateProjectInput,
  ): Promise<UpdateResult> {
    return this.projectRepository.update(
      updateProjectInput.uuid,
      updateProjectInput,
    );
  }

  /**
   * Deletes a project
   * @param {DeleteProjectInput} deleteProjectInput - Input containing the uuid of the project to delete
   * @return {Promise<DeleteResult>} - Result object from deletion
   */
  async deleteProject(deleteProjectInput: DeleteProjectInput) {
    return this.projectRepository.delete(deleteProjectInput.uuid);
  }

  /**
   * Removes devices from their associated project(s)
   * @param {RemoveDevicesFromProjectInput} removeDevicesFromProjectInput - contains MR2000/3000 instances to remove
   * @returns {Promise<void>} - done
   */
  async removeDevicesFromProject(
    removeDevicesFromProjectInput: RemoveDevicesFromProjectInput,
  ) {
    // Remove MR2000s, if any
    for (const mr2000 of removeDevicesFromProjectInput.mr2000instances ?? []) {
      await removeDeviceFromProject(mr2000, true);
    }
    // Remove MR3000s, if any
    for (const mr3000 of removeDevicesFromProjectInput.mr3000instances ?? []) {
      await removeDeviceFromProject(mr3000, false);
    }
  }
  /**
   * Validates if the given user has access to the given project
   * @param {Record<string, string>} user - User that demands access
   * @param {string} projectUuid - UUID of the project which the user wants to access
   * @private
   * @return {boolean} - validation result
   */
  async validateAccessToProject(
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
}
