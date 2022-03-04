import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { GetProjectDevicesArgs } from '../device/dto/args/get-project-devices.args';
import { fetchFromTable } from '../../helpers/database-helpers';
import {
  mr2000fromDatabaseEntry,
  mr3000fromDatabaseEntry,
  removeDeviceFromProject,
} from '../../helpers/device-helpers';
import { GetUserProjectsArgs } from './dto/args/get-user-projects.args';
import { getProjectsForInstances } from '../../helpers/project-helpers';
import { CreateProjectInput } from './dto/input/create-project.input';
import { RemoveDevicesFromProjectInput } from './dto/input/remove-devices-from-project.input';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Returns a list the devices belonging to a given project
   * @param {GetProjectDevicesArgs} getProjectDevicesArgs - contains project name
   * @returns {Promise<MR2000|MR3000[]>} - the user's devices
   */
  async getProjectDevices(getProjectDevicesArgs: GetProjectDevicesArgs) {
    // Note that in the actual database, project names may contain trailing whitespace (but is ignores by SQL)
    const filterQuery = `WHERE comment='${getProjectDevicesArgs.name}'`;

    // Get all MR2000 & MR3000 instances
    const mr2000instances = await fetchFromTable(
      'MR2000',
      'station',
      filterQuery,
    );
    const mr3000instances = await fetchFromTable(
      'MR3000',
      'station',
      filterQuery,
    );

    const devices = [];

    // Add all MR2000 instances
    mr2000instances.forEach((instance) => {
      devices.push(mr2000fromDatabaseEntry(instance));
    });

    // Add all MR3000 instances
    mr3000instances.forEach((instance) => {
      devices.push(mr3000fromDatabaseEntry(instance));
    });

    return devices;
  }

  /**
   * Returns a list of the user's projects
   * @param {GetUserProjectsArgs} getUserProjectsArgs - contains user's UUID
   * @returns {Promise<Project[]>} - the user's projects
   */
  async getUserProjects(getUserProjectsArgs: GetUserProjectsArgs) {
    // Get user
    const user = await this.usersRepository.findOne(getUserProjectsArgs.uuid);

    if (!user) {
      throw new Error(`No user found for ${getUserProjectsArgs.uuid}`);
    }

    // Get all MR2000 & MR3000 instances
    const mr2000instances = await fetchFromTable('MR2000', 'station');
    const mr3000instances = await fetchFromTable('MR3000', 'station');

    // Build list of projects from instances
    const projects = getProjectsForInstances(mr2000instances, mr3000instances);

    // Filter by projects that the user has access to
    return projects.filter((project) => user.projects.includes(project.name));
  }

  /**
   * Returns a list of the user's projects
   * @param {CreateProjectInput} createProjectInput - contains project name & associated MR2000/3000 instances
   * @param {string} userUuid - the user to create the project for (automatically adds related permission)
   * @returns {Promise<Project>} - the newly created project
   */
  async createProject(
    createProjectInput: CreateProjectInput,
    userUuid: string,
  ) {
    const projectName = createProjectInput.name;
    const user = await this.usersRepository.findOne(userUuid);

    // Ensure project name is not already present (in actual projects and/or permissions)
    const userProjects = await this.getUserProjects({ uuid: userUuid });
    const userProjectPermissions = user.projects;
    if (
      userProjectPermissions.find((project) => project.name === projectName) ||
      userProjects.find((project) => project.name === projectName)
    ) {
      throw new Error(`Project name ${projectName} is already taken`);
    }

    // TODO: Add as comment on all relevant tables, at least: 'station', 'param'

    // Create new project
    const newProject = this.projectRepository.create({
      name: createProjectInput.name,
      user: user,
      mr2000instances: createProjectInput.mr2000instances,
      mr3000instances: createProjectInput.mr3000instances,
    });
    await this.projectRepository.save(newProject);

    return newProject;

    // // Get all MR2000 & MR3000 instances
    // const mr2000instances = await fetchFromTable('MR2000', 'station');
    // const mr3000instances = await fetchFromTable('MR3000', 'station');
    //
    // // Build list of projects from instances
    // const projects = getProjectsForInstances(mr2000instances, mr3000instances);
    //
    // // Filter by projects that the user has access to
    // return projects.filter((project) => user.projects.includes(project.name));
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
}
