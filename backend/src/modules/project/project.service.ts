import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { GetProjectDevicesArgs } from '../user/dto/args/get-project-devices.args';
import { fetchFromTable } from '../../helpers/database-helpers';
import {
  mr2000fromDatabaseEntry,
  mr3000fromDatabaseEntry,
} from '../../helpers/device-helpers';
import { GetUserProjectsArgs } from '../user/dto/args/get-user-projects.args';
import { getProjectsForInstances } from '../../helpers/project-helpers';

@Injectable()
export class ProjectService {
  constructor(
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
}
