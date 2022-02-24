/**
 * This file contains all device-related (MR2000/MR3000) helper functions
 */

import { MR2000 } from '../types/MR2000';
import { MR3000 } from '../types/MR3000';

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
    // entry.mr_SN as string,
    // entry.PID as string,
    // entry.last_file as number,
  );
}
