import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { GetProjectDevicesArgs } from '../device/dto/args/get-project-devices.args';
import { findProjectForDevice } from '../../helpers/device-helpers';
import { GetUserProjectsArgs } from './dto/args/get-user-projects.args';
import { CreateProjectInput } from './dto/input/create-project.input';
import { RemoveDeviceFromProjectInput } from './dto/input/remove-device-from-project.input';
import { Project } from './entities/project.entity';
import { UpdateProjectInput } from './dto/input/update-project-input';
import { DeleteProjectInput } from './dto/input/delete-project.input';
import { AssignDeviceToProjectInput } from './dto/input/assign-device-to-project.input';
import { UserService } from '../user/user.service';
import { GetUserArgs } from '../user/dto/args/get-user.args';
import { ROLE } from '../../ENUM/ENUM';
import { ERRORS } from '../../error/ERRORS';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { DeviceService } from '../device/device.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly deviceService: DeviceService,
  ) {}

  /**
   * Returns a list the devices belonging to a given project
   * @param {GetProjectDevicesArgs} getProjectDevicesArgs - contains project uuid
   * @returns {Promise<MR2000|MR3000[]>} - the user's devices
   */
  async getProjectDevices(getProjectDevicesArgs: GetProjectDevicesArgs) {
    // Get project
    const project = await this.projectRepository.findOne(
      getProjectDevicesArgs.uuid,
    );

    if (!project) {
      throw new Error(`No project found for ${getProjectDevicesArgs.uuid}`);
    }

    return this.deviceService.getDevices(project.devices);
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

    if (
      userProjects.find(
        (project) => project.name.toLowerCase() === projectName.toLowerCase(),
      )
    ) {
      throw new Error(`Project name ${projectName} is already taken`);
    }

    // Create new project
    const newProject = this.projectRepository.create({
      name: createProjectInput.name,
      user: user,
      devices: createProjectInput.devices ?? [],
    });
    await this.projectRepository.save(newProject);

    return newProject;
  }

  /**
   * Updates a project
   * @param {UpdateProjectInput} updateProjectInput Project parameters that should be changed.
   * @param {string} userUuid - user's database UUID
   * @return {Promise<Project>} - The updated project
   */
  async updateProjectName(
    updateProjectInput: UpdateProjectInput,
    userUuid: string,
  ) {
    // Get user's existing projects and ensure they have no project by this name yet
    const userProjects = await this.getUserProjects({ uuid: userUuid });
    if (
      userProjects.find(
        (project) =>
          project.name.toLowerCase() === updateProjectInput.name.toLowerCase(),
      )
    ) {
      throw new Error(
        `Project name ${updateProjectInput.name} is already taken`,
      );
    }

    await this.projectRepository.update(updateProjectInput.uuid, {
      name: updateProjectInput.name,
    });

    return this.projectRepository.findOne(updateProjectInput.uuid);
  }

  /**
   * Deletes a project
   * @param {DeleteProjectInput} deleteProjectInput - Input containing the uuid of the project to delete
   * @return {Promise<Project>} - Deleted project
   */
  async deleteProject(deleteProjectInput: DeleteProjectInput) {
    const project = this.projectRepository.findOne(deleteProjectInput.uuid);

    await this.projectRepository.delete(deleteProjectInput.uuid);

    return project;
  }

  /**
   * Removes devices from their associated project(s)
   * @param {RemoveDeviceFromProjectInput} removeDeviceFromProjectInput - contains project UUID and device CLI
   * @returns {Promise<Project>} - updated project
   */
  async removeDeviceFromProject(
    removeDeviceFromProjectInput: RemoveDeviceFromProjectInput,
  ) {
    // Get project
    const project = await this.projectRepository.findOne(
      removeDeviceFromProjectInput.uuid,
    );

    if (!project) {
      throw new Error(
        `No project found for ${removeDeviceFromProjectInput.uuid}`,
      );
    }

    const cli = removeDeviceFromProjectInput.cli;

    const validDevice = project.devices.includes(cli);

    // Throw error if given device is not part of given project
    if (!validDevice) {
      throw new Error(
        `Device ${cli} is not assigned to project ${removeDeviceFromProjectInput.uuid}`,
      );
    }

    // Build partial entity, depending on type
    const updateData = {
      devices: project.devices.filter((instance) => instance !== cli),
    };

    await this.projectRepository.update(
      removeDeviceFromProjectInput.uuid,
      updateData,
    );

    return this.projectRepository.findOne(removeDeviceFromProjectInput.uuid);
  }

  /**
   * Removes devices from their associated project(s)
   * @param {AssignDeviceToProjectInput} assignDeviceToProjectInput - contains project UUID and device CLI
   * @returns {Promise<Project>} - updated project
   */
  async assignDeviceToProject(
    assignDeviceToProjectInput: AssignDeviceToProjectInput,
  ) {
    // Get project
    const project = await this.projectRepository.findOne(
      assignDeviceToProjectInput.uuid,
    );

    if (!project) {
      throw new Error(
        `No project found for ${assignDeviceToProjectInput.uuid}`,
      );
    }

    // Determine type
    const cli = assignDeviceToProjectInput.cli;

    // Throw error if device is already part of a project
    const existingProject = await findProjectForDevice(
      this.projectRepository,
      cli,
    );
    if (existingProject) {
      throw new Error(`Device ${cli} is already assigned to a project`);
    }

    // Build partial entity, depending on type
    const updateData = {
      devices: (project.devices ?? []).concat([cli]),
    } as unknown as QueryDeepPartialEntity<Project>;

    await this.projectRepository.update(
      assignDeviceToProjectInput.uuid,
      updateData,
    );

    return this.projectRepository.findOne(assignDeviceToProjectInput.uuid);
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

  /**
   * Validates if the given user has access to the given device
   * @param {Record<string, string>} user - User that demands access
   * @param {string} cli - CLI of the device which the user wants to access
   * @private
   * @return {boolean} - validation result
   */
  async validateAccessToDevice(
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
      !dbUser.devices.some((device) => device === cli)
    ) {
      throw new Error(ERRORS.resource_not_allowed);
    }
    return true;
  }
}
