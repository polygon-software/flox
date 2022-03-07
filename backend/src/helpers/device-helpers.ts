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
 * @param {Record<string, unknown>} vpnEntry - entry in VPN table
 * @param {Record<string, unknown>} [storeEntry] - entry in store table, if any
 * @returns {Promise<MR2000>} - MR2000 instance
 */
export async function mr2000fromDatabaseEntry(
  entry: Record<string, unknown>,
  projectRepository: Repository<Project>,
  vpnEntry: Record<string, unknown>,
  storeEntry?: Record<string, unknown>,
) {
  // Find project the instance belongs to project (if any)
  const project = await findProjectForDevice(
    projectRepository,
    entry.cli as string,
    true,
  );

  return new MR2000(
    entry.cli as string, // Device CLIs
    deviceNameFromComment(entry.comment as string), // Device name
    entry.mr_SN as string, // Serial number
    entry.PID as string, // PID
    entry.last_file as number, // File number
    project, // Project (if any)
    !!storeEntry, // FTP forward status (true if an entry is present)
    vpnEntry ? (vpnEntry.vpn_ip as string) : null,
  );
}

/**
 * Creates an MR3000 instance from a RowPacketData entry
 * @param {Record<string, string|number>} entry - database entry row
 * @param {Repository<Project>} projectRepository - project repository to search in
 * @param {Record<string, unknown>} vpnEntry - entry in VPN table
 * @param {Record<string, unknown>} [storeEntry] - entry in store table, if any
 * @returns {Promise<MR3000>} - MR3000 instance
 */
export async function mr3000fromDatabaseEntry(
  entry: Record<string, unknown>,
  projectRepository: Repository<Project>,
  vpnEntry: Record<string, unknown>,
  storeEntry?: Record<string, unknown>,
) {
  // Find project the instance belongs to project (if any)
  const project = await findProjectForDevice(
    projectRepository,
    entry.cli as string,
    true,
  );

  return new MR3000(
    entry.cli as string, // Device CLI
    deviceNameFromComment(entry.comment as string), // Device name
    entry.mr_SN as string, // Serial Number
    project, // Project (if any)
    !!storeEntry, // FTP forward status (true if an entry is present)
    vpnEntry ? (vpnEntry.vpn_ip as string) : null,
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

/**
 * Extracts the device name from a comment string (e.g. "ZC-123TestDevice" -> "TestDevice")
 * @param {string} comment - database comment
 * @returns {string} - device name
 */
function deviceNameFromComment(comment: string) {
  if (!comment.startsWith('ZC-')) {
    throw new Error('Invalid device name');
  }
  return comment.substring(6).trim();
}
