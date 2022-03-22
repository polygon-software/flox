/**
 * This file contains all device-related (MR2000/MR3000) helper functions
 */

import { MR2000 } from '../types/MR2000';
import { MR3000 } from '../types/MR3000';
import { Repository, Like } from 'typeorm';
import { Project } from '../modules/project/entities/project.entity';
import { ConnectionLogEntry } from '../types/ConnectionLogEntry';
import { DeviceLogEntry } from '../types/DeviceLogEntry';
import { DeviceContact } from '../types/DeviceContact';
import { FTPLogEntry } from '../types/FTPLogEntry';

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
  const searchString = Like(`%${cli}%`);
  const filterQuery = isMr2000
    ? { mr2000instances: searchString }
    : { mr3000instances: searchString };
  return projectRepository.findOne({ where: filterQuery });
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
  entry: Record<string, string | boolean | number>,
) {
  const type = deviceType(entry.cli as string);
  const isMR2000 = type === 'MR2000';

  return new DeviceContact(
    (isMR2000 ? entry.uniq_id : entry.rec_id) as number,
    entry.cli as string,
    entry.name as string,
    entry.email as string,
    entry.phone as string,
    (isMR2000 ? entry.event : entry.event_all) as boolean,
    (isMR2000 ? entry.alarm1 : entry.event_alarm1) as boolean,
    (isMR2000 ? entry.alarm2 : entry.event_alarm2) as boolean,
    entry.soh_sms_limit as boolean,
    entry.soh_power as boolean,
    isMR2000 ? null : (entry.soh_sdcard as boolean),
    entry.daily as boolean,
  );
}

/**
 * Creates a connection log entry instance from a RowPacketData entry
 * @param {Record<string, string|number>} entry - database entry row
 * @returns {Promise<ConnectionLogEntry>} - log entry
 */
export async function connectionLogEntryFromDatabaseEntry(
  entry: Record<string, unknown>,
) {
  return new ConnectionLogEntry(
    entry.id as number,
    entry.cli as string,
    entry.timestamp as Date,
    entry.vpn_ip as string,
    entry.real_ip as string,
    entry.port as string,
    entry.traffic as number,
    entry.reason as string,
  );
}

/**
 * Maps a device log entry string to a DeviceLogEntry instance
 * @param {string} entry - a single log line
 * @returns {DeviceLogEntry} - log entry instance
 */
export function mapDeviceLogEntry(entry: string) {
  // Sample input: '2021.4.7 15:48:40 Update 39-11 no of events: 0 no of peaks: 1 \n'
  const splitEntry = entry.split(' ');

  // Extract timestamp string (e.g. 2021.4.7 15:48:40)
  const timestampString = `${splitEntry[0]} ${splitEntry[1]}`;
  const timestamp = new Date(timestampString);

  // Extract message
  let message = splitEntry.slice(2, splitEntry.length).join(' ');

  // Remove trailing ' \n'
  message = message.substring(0, message.length - 2);

  // const date =
  return new DeviceLogEntry(timestamp, message);
}

/**
 * Maps a FP log entry string to a DeviceLogEntry instance
 * @param {string} entry - a single log line
 * @returns {FTPLogEntry} - log entry instance
 */
export function mapFTPLogEntry(entry: string) {
  // Sample input: 'Tue Oct 06 17:29:21 2020 0 81.6.40.183 768 /var/data/measurements/44_08/44_08/background/2020/10/20280007.BMR b _ i r 44_08 ftp 0 * c\n'

  // Split, e.g. ['Tue', 'Oct', '06', '17:29:21', '2020', '0', '81.5.40.183', '768', ...]
  const splitParams = entry.split(' ');

  // Build timestamp string (e.g. Tue Oct 06 17:29:21 2020)
  const timestampString = splitParams.slice(0, 5).join(' ');
  const timestamp = new Date(timestampString);

  // Extract IP & path
  const ip = splitParams[6];
  const path = splitParams[8];

  // Build entry object
  return new FTPLogEntry(timestamp, ip, path);
}
