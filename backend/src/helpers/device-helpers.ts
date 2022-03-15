/**
 * This file contains all device-related (MR2000/MR3000) helper functions
 */

import { MR2000 } from '../types/MR2000';
import { MR3000 } from '../types/MR3000';
import { Repository } from 'typeorm';
import { Project } from '../modules/project/entities/project.entity';
import { DeviceContact } from '../types/DeviceContact';

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
  // Find project the instance belongs to (if any)
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
    entry.firmware as string,
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
    false,
  );

  return new MR3000(
    entry.cli as string, // Device CLI
    deviceNameFromComment(entry.comment as string), // Device name
    entry.mr_SN as string, // Serial Number
    project, // Project (if any)
    !!storeEntry, // FTP forward status (true if an entry is present)
    vpnEntry ? (vpnEntry.vpn_ip as string) : null,
    entry.firmware as string,
  );
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

/**
 * Returns the device type associated with the client id
 * @param {string} clientId - the client id
 * @returns {'MR2000'|'MR3000'} - the device type
 */
export function deviceType(clientId: string) {
  return clientId.includes('-') ? 'MR2000' : 'MR3000';
}

/**
 * Creates a DeviceContact instance from a RowPacketData entry
 * @param {Record<string, string|number>} entry - database entry row
 * @returns {Promise<DeviceContact>} - Device contact instance
 */
export async function deviceContactFromDatabaseEntry(
  entry: Record<string, string | boolean>,
) {
  const type = deviceType(entry.cli as string);
  const isMR2000 = type === 'MR2000';

  return new DeviceContact(
    (isMR2000 ? entry.uniq_id : entry.rec_id) as string,
    entry.name as string,
    entry.email as string,
    entry.phone as string,
    (isMR2000 ? entry.event : entry.event_all) as boolean,
    (isMR2000 ? entry.alarm1 : entry.event_alarm1) as boolean,
    (isMR2000 ? entry.alarm2 : entry.event_alarm2) as boolean,
    entry.soh_sms_limit as boolean,
    entry.soh_power as boolean,
    true, // TODO where to get/store memory?
    entry.daily as boolean,
  );
}
