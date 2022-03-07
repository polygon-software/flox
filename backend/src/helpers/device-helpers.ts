/**
 * This file contains all device-related (MR2000/MR3000) helper functions
 */

import { MR2000 } from '../types/MR2000';
import { MR3000 } from '../types/MR3000';
import { getQueryRunner } from './database-helpers';
import { Repository } from 'typeorm';
import { Project } from '../modules/project/entities/project.entity';

/**
 * Creates an MR2000 instance from a RowPacketData entry
 * @param {Record<string, string|number>} entry - database entry row
 * @param {Repository<Project>} projectRepository - project repository to search in
 * @returns {Promise<MR2000>} - MR2000 instance
 */
export async function mr2000fromDatabaseEntry(
  entry: Record<string, unknown>,
  projectRepository: Repository<Project>,
) {
  // Find project the instance belongs to project (if any)
  const project = await findProjectForDevice(
    projectRepository,
    entry.cli as string,
    true,
  );

  return new MR2000(
    entry.cli as string,
    entry.mr_SN as string,
    entry.PID as string,
    entry.last_file as number,
    project,
  );
}

/**
 * Creates an MR3000 instance from a RowPacketData entry
 * @param {Record<string, string|number>} entry - database entry row
 * @param {Repository<Project>} projectRepository - project repository to search in
 * @returns {Promise<MR3000>} - MR3000 instance
 */
export async function mr3000fromDatabaseEntry(
  entry: Record<string, unknown>,
  projectRepository: Repository<Project>,
) {
  // Find project the instance belongs to project (if any)
  const project = await findProjectForDevice(
    projectRepository,
    entry.cli as string,
    true,
  );

  return new MR3000(
    entry.cli as string,
    entry.mr_SN as string,
    project,
    // entry.PID as string,
    // entry.last_file as number,
  );
}

/**
 * Removes a device from any project at database level
 * @param {MR2000|MR3000} device - the device to remove
 * @param {boolean} isMr2000 - whether it's an MR2000 device
 * @returns {Promise<void>} - done
 */
export async function removeDeviceFromProject(
  device: MR2000 | MR3000,
  isMr2000: boolean,
) {
  // TODO functionality
}

/**
 * Find the project the given instance belongs to (if any)
 * @param {Repository<Project>} projectRepository - repository to search in
 * @param {string} cli - device name (CLI)
 * @param {boolean} isMr2000 - whether it's an MR2000 device
 * @returns {Promise<void|Project>} - project, if any
 */
export async function findProjectForDevice(
  projectRepository: Repository<Project>,
  cli: string,
  isMr2000: boolean,
) {
  return projectRepository
    .createQueryBuilder('project')
    .where(
      `:cli=ANY(project.${isMr2000 ? 'mr2000instances' : 'mr3000instances'})`,
      { cli },
    )
    .getOne();
}
