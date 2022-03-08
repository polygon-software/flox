import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { GetProjectDevicesArgs } from '../device/dto/args/get-project-devices.args';
import {
  findProjectForDevice,
  mr2000fromDatabaseEntry,
  mr3000fromDatabaseEntry,
} from '../../helpers/device-helpers';
import { GetUserProjectsArgs } from './dto/args/get-user-projects.args';
import { CreateProjectInput } from './dto/input/create-project.input';
import { RemoveDeviceFromProjectInput } from './dto/input/remove-device-from-project.input';
import { Project } from './entities/project.entity';
import { UpdateProjectInput } from './dto/input/update-project-input';
import { DeleteProjectInput } from './dto/input/delete-project.input';
import { fetchFromTable } from '../../helpers/database-helpers';
import { MR2000 } from '../../types/MR2000';
import { MR3000 } from '../../types/MR3000';
import { AssignDeviceToProjectInput } from './dto/input/assign-device-to-project.input';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
    // Get all MR2000 & MR3000 instances
    const mr2000instances = await fetchFromTable('MR2000', 'station');
    const mr3000instances = await fetchFromTable('MR3000', 'station');

    // Fetch stores for FTP info
    const mr2000store = await fetchFromTable('MR2000', 'store');
    const mr3000store = await fetchFromTable('MR3000', 'store');

    // Fetch VPN table for FTP info
    const vpnInfo = await fetchFromTable('openvpn', 'tempovp');

    const devices = [];

    // Add all MR2000 instances that belong to the project
    for (const instance of mr2000instances) {
      if ((project.mr2000instances ?? []).includes(instance.cli)) {
        const mr2000 = await mr2000fromDatabaseEntry(
          instance,
          this.projectRepository,
          vpnInfo.find((vpnEntry) => vpnEntry.cli === instance.cli),
          mr2000store.find((storeEntry) => storeEntry.cli === instance.cli),
        );
        devices.push(mr2000);
      }
    }

    // Add all MR3000 instances that belong to the project
    for (const instance of mr3000instances) {
      if ((project.mr3000instances ?? []).includes(instance.cli)) {
        const mr3000 = await mr3000fromDatabaseEntry(
          instance,
          this.projectRepository,
          vpnInfo.find((vpnEntry) => vpnEntry.cli === instance.cli),
          mr3000store.find((storeEntry) => storeEntry.cli === instance.cli),
        );
        devices.push(mr3000);
      }
    }

    return devices;
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

    const validMr2000 = project.mr2000instances.includes(cli);
    const validMr3000 = project.mr3000instances.includes(cli);

    // Throw error if given device is not part of given project
    if (!validMr2000 && !validMr3000) {
      throw new Error(
        `Device ${cli} is not assigned to project ${removeDeviceFromProjectInput.uuid}`,
      );
    }

    // Build partial entity, depending on type
    const updateData = validMr2000
      ? {
          mr2000instances: project.mr2000instances.filter(
            (instance) => instance !== cli,
          ),
        }
      : {
          mr3000instances: project.mr3000instances.filter(
            (instance) => instance !== cli,
          ),
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

    const cli = assignDeviceToProjectInput.cli;
    const isMr2000 = cli.includes('-'); // TODO use helper function once present

    // Throw error if device is already part of a project
    const existingProject = await findProjectForDevice(
      this.projectRepository,
      cli,
      isMr2000,
    );
    if (existingProject) {
      throw new Error(`Device ${cli} is already assigned to a project`);
    }

    // Build partial entity, depending on type
    const updateData = isMr2000
      ? {
          mr2000instances: project.mr2000instances.concat(cli),
        }
      : {
          mr3000instances: project.mr3000instances.concat(cli),
        };

    await this.projectRepository.update(
      assignDeviceToProjectInput.uuid,
      updateData,
    );

    return this.projectRepository.findOne(assignDeviceToProjectInput.uuid);
  }
}
