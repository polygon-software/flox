import {ROLE} from 'src/data/ENUM';
import {User} from 'src/data/types/User';

/**
 * This file contains all helper functions for mapping data structures received via GraphQL queries to actual class instances
 */

/**
 * Map user record to user instance.
 * @param {Record<string, unknown>} record - user record.
 * @returns {User} - user instance.
 */
export function mapUser(record: Record<string, unknown>): User {
  return new User(
    record.role as ROLE,
    record.uuid as string,
    record.name as string,
  );
}

/**
 * Map multiple user record to user instances.
 * @param {Record<string, unknown>[]} records - user records.
 * @returns {User[]} - user instances.
 */
export function mapUsers(records: Record<string, unknown>[]): User[] {
  return records.map((user) => mapUser(user))
}
