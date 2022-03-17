import { executeQuery, subscribeToQuery } from 'src/helpers/data-helpers';
import { ALL_USERS, MY_USER, USER } from 'src/data/queries/USER';
import { User } from 'src/data/types/User';
import { Address } from 'src/data/types/Address';
import { ROLE } from 'src/data/ENUM';
import { Project } from 'src/data/types/Project';
import {MY_PROJECTS} from 'src/data/queries/PROJECT';
import {MY_DEVICES, PROJECT_DEVICES} from 'src/data/queries/DEVICE';
import {Device} from 'src/data/types/Device';
import {computed, Ref} from 'vue';

/**
 * Fetch all users.
 * @returns {Promise<User[] | null>} - all users.
 */
export async function fetchAllUsers(): Promise<User[]> {
  const queryResult = await executeQuery(ALL_USERS);
  if(!queryResult.data[ALL_USERS.cacheLocation]){
    return []
  }
  return mapUsers(queryResult.data[ALL_USERS.cacheLocation] as Record<string, unknown>[]);
}

/**
 * Fetch user.
 * @param {string} userId - user UUID.
 * @returns {Promise<User | null>} - user.
 */
export async function fetchUser(userId: string): Promise<User | null> {
  const queryResult = await executeQuery(USER, { uuid: userId });
  if(!queryResult.data[USER.cacheLocation]){
    return null
  }
  return mapUser(queryResult.data[USER.cacheLocation] as Record<string, unknown>);
}

/**
 * Fetch own user.
 * @returns {Promise<User | null>} - user.
 */
export async function myUser(): Promise<User | null> {
  const queryResult = await executeQuery(MY_USER);
  if(!queryResult.data[MY_USER.cacheLocation]){
    return null
  }
  return mapUser(queryResult.data[MY_USER.cacheLocation] as Record<string, unknown>);
}

/**
 * Fetch all projects belonging to current user
 * @return {Promise<Project[]>} - An array containing all the user's projects
 */
export async function myProjects(): Promise<Project[]> {
  const projects: Project[] = [];
  const queryResult = await executeQuery(MY_PROJECTS);
  if(queryResult.data[MY_PROJECTS.cacheLocation]){
    for (const project of queryResult.data[MY_PROJECTS.cacheLocation] as Record<string, unknown>[]) {
      projects.push(mapProject(project));
    }
  }
  return projects
}

/**
 * Fetch all devices that are part of a given project project
 * @param {string} uuid - the project's uuid
 * @return {Promise<Device[]>} - An array containing all the user's projects
 */
export async function fetchProjectDevices(uuid: string): Promise<Device[]> {
  const devices: Device[] = [];
  const queryResult = await executeQuery(PROJECT_DEVICES, {uuid});
  if(queryResult.data[PROJECT_DEVICES.cacheLocation]){
    for (const device of queryResult.data[PROJECT_DEVICES.cacheLocation] as Record<string, unknown>[]) {
      devices.push(mapDevice(device));
    }
  }
  return devices
}

/**
 * Fetch all of the current user's devices
 * @param {Record<string, string>} [params] - query parameters for filtering ('unassigned' / 'assigned')
 * @return {ComputedRef<Device[]>} - An array containing all the user's projects
 */
export function myDevices(params?: Record<string, boolean>) {
  const queryResult = subscribeToQuery(MY_DEVICES, params) as Ref<Record<string, unknown>[]>;
  return computed(() => {
    const devices: Device[] = [];
    if(queryResult.value){
      for (const device of queryResult.value ) {
        devices.push(mapDevice(device));
      }
    }
    return devices
  });
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
    record.projects as Project[],
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

/**
 * Map project record to project instance.
 * @param {Record<string, unknown>} record - project record.
 * @returns {Project} - project instance.
 */
export function mapProject(record: Record<string, unknown>): Project {
  return new Project(
    record.name as string,
    record.uuid as string,
    record.user as User,
    record.mr2000instances as string[],
    record.mr3000instances as string[],
  )
}

/**
 * Map device record (MR2000 or MR3000) to device instance.
 * @param {Record<string, unknown>} record - project record.
 * @returns {Project} - project instance.
 */
export function mapDevice(record: Record<string, unknown>): Device {
  return new Device(
    record.cli as string,
    record.name as string,
    record.serialNumber as string,
    record.project as Project,
    record.pid as string ?? '-',
    record.ftp as boolean,
    record.ip as string ?? '-',
    record.firmware as string,
    record.__typename as ('MR2000'|'MR3000')
  )
}
