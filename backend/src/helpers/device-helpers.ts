/**
 * This file contains all device-related (MR2000/MR3000) helper functions
 */

import { MR2000 } from '../types/MR2000';
import { MR3000 } from '../types/MR3000';
import { getQueryRunner } from './database-helpers';

/**
 * Creates an MR2000 instance from a RowPacketData entry
 * @param {Record<string, string|number>} entry - database entry row
 * @returns {MR2000} - MR2000 instance
 */
export function mr2000fromDatabaseEntry(entry: Record<string, unknown>) {
  return new MR2000(
    entry.cli as string,
    entry.mr_SN as string,
    entry.PID as string,
    entry.last_file as number,
  );
}

/**
 * Creates an MR3000 instance from a RowPacketData entry
 * @param {Record<string, string|number>} entry - database entry row
 * @returns {MR3000} - MR3000 instance
 */
export function mr3000fromDatabaseEntry(entry: Record<string, unknown>) {
  return new MR3000(
    entry.cli as string,
    entry.mr_SN as string,
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
  const databaseName = isMr2000 ? 'MR2000' : 'MR3000';
  const queryRunner = await getQueryRunner(databaseName);

  // List of tables where a device's project is stored in the 'comment' field
  // (since this is different between MR2000 and MR3000 devices)
  const affectedTables = isMr2000 ? ['station', 'param'] : ['station'];

  // TODO: On database, write 'comment' as null

  // Close database connection
  await queryRunner.release();
}
