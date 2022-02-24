import { executeQuery } from 'src/helpers/data-helpers';
import { ALL_USERS, MY_USER, USER } from 'src/data/queries/USER';
import { User } from 'src/data/types/User';
import { Address } from 'src/data/types/Address';
import { ROLE } from 'src/data/ENUM';

/**
 * Fetch all users.
 * @returns {Promise<User[] | null>} - all users.
 */
export async function fetchAllUsers(): Promise<User[]> {
  const queryResult = await executeQuery(ALL_USERS);
  if(!queryResult.data?.allUsers){
    return []
  }
  return mapUsers(queryResult.data.allUsers as Record<string, unknown>[]);
}

/**
 * Fetch user.
 * @param {string} userId - user UUID.
 * @returns {Promise<User | null>} - user.
 */
export async function fetchUser(userId: string): Promise<User | null> {
  const queryResult = await executeQuery(USER, { uuid: userId });
  if(!queryResult.data?.user){
    return null
  }
  return mapUser(queryResult.data.user as Record<string, unknown>);
}

/**
 * Fetch own user.
 * @returns {Promise<User | null>} - user.
 */
export async function myUser(): Promise<User | null> {
  const queryResult = await executeQuery(MY_USER);
  if(!queryResult.data?.myUser){
    return null
  }
  return mapUser(queryResult.data.myUser as Record<string, unknown>);
}

/**
 * Map user records to user instances.
 * @param {Record<string, unknown>[]} records - user records.
 * @returns {User[]} - user instances.
 */
export function mapUsers(records: Record<string, unknown>[]): User[] {
  return records.map((record) => mapUser(record));
}

/**
 * Map user record to user instance.
 * @param {Record<string, unknown>} record - user record.
 * @returns {User} - user instance.
 */
export function mapUser(record: Record<string, unknown>): User {
  return new User(
    record.role as ROLE,
    record.uuid as string,
    record.username as string,
    record.email as string,
    record.cognitoUuid as string,
    record.fullName as string,
    mapAddress(record.address as Record<string, unknown>),
    record.phone as string,
    new Date(record.birthdate as string),
    record.projects as string[],
    record.mr2000instances as string[],
    record.mr3000instances as string[],
  )
}

/**
 * Map address record to address instance.
 * @param {Record<string, unknown>|undefined} record - address record.
 * @returns {Address|undefined} - address instance.
 */
export function mapAddress(record: Record<string, unknown>|undefined): Address|undefined {
  if(record !== undefined) {
    return new Address(
      record.street as string,
      record.number as string,
      record.city as string,
      record.zipCode as string
    );
  } else {
    return undefined;
  }
}
