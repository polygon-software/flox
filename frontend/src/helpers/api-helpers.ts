import { executeQuery, subscribeToQuery } from 'src/helpers/data-helpers';
import { ALL_USERS, MY_USER, USER } from 'src/data/queries/USER';
import { User } from 'src/data/types/User';
import { ROLE } from 'src/data/ENUM';
import { Project } from 'src/data/types/Project';
import { MY_PROJECTS } from 'src/data/queries/PROJECT';
import {
  DEVICE_CONTACTS,
  MY_DEVICES,
  PROJECT_DEVICES,
} from 'src/data/queries/DEVICE';
import { Device } from 'src/data/types/Device';
import { computed, ComputedRef, Ref } from 'vue';
import { DeviceContact } from 'src/data/types/DeviceContact';
import { MY_CONTACTS } from 'src/data/queries/CONTACT';

/**
 * Fetch all users.
 * @returns {Promise<User[] | null>} - all users.
 */
export async function fetchAllUsers(): Promise<User[]> {
  const queryResult = await executeQuery(ALL_USERS);
  if (!queryResult.data[ALL_USERS.cacheLocation]) {
    return [];
  }
  return mapUsers(
    queryResult.data[ALL_USERS.cacheLocation] as Record<string, unknown>[]
  );
}

/**
 * Fetch user.
 * @param {string} userId - user UUID.
 * @returns {Promise<User | null>} - user.
 */
export async function fetchUser(userId: string): Promise<User | null> {
  const queryResult = await executeQuery(USER, { uuid: userId });
  if (!queryResult.data[USER.cacheLocation]) {
    return null;
  }
  return mapUser(
    queryResult.data[USER.cacheLocation] as Record<string, unknown>
  );
}

/**
 * Fetch own user.
 * @returns {Promise<User | null>} - user.
 */
export async function myUser(): Promise<User | null> {
  const queryResult = await executeQuery(MY_USER);
  if (!queryResult.data[MY_USER.cacheLocation]) {
    return null;
  }
  return mapUser(
    queryResult.data[MY_USER.cacheLocation] as Record<string, unknown>
  );
}

/**
 * Fetch all projects belonging to current user
 * @return {Promise<Project[]>} - An array containing all the user's projects
 */
export async function myProjects(): Promise<Project[]> {
  const projects: Project[] = [];
  const queryResult = await executeQuery(MY_PROJECTS);
  if (queryResult.data[MY_PROJECTS.cacheLocation]) {
    for (const project of queryResult.data[MY_PROJECTS.cacheLocation] as Record<
      string,
      unknown
    >[]) {
      projects.push(mapProject(project));
    }
  }
  return projects;
}

/**
 * Fetch all devices that are part of a given project
 * @param {string} uuid - the project's uuid
 * @return {Promise<Device[]>} - An array containing all the user's projects
 */
export async function fetchProjectDevices(uuid: string): Promise<Device[]> {
  const devices: Device[] = [];
  const queryResult = await executeQuery(PROJECT_DEVICES, { uuid });
  if (queryResult.data[PROJECT_DEVICES.cacheLocation]) {
    for (const device of queryResult.data[
      PROJECT_DEVICES.cacheLocation
    ] as Record<string, unknown>[]) {
      devices.push(mapDevice(device));
    }
  }
  return devices;
}

/**
 * Fetch all of the current user's devices
 * @param {Record<string, string>} [params] - query parameters for filtering ('unassigned' / 'assigned')
 * @return {ComputedRef<Device[]>} - An array containing all the user's projects
 */
export function myDevices(
  params?: Record<string, boolean>
): ComputedRef<Device[]> {
  const queryResult = subscribeToQuery(MY_DEVICES, params) as Ref<
    Record<string, unknown>[]
  >;
  return computed(() => mapDevices(queryResult.value ?? []));
}

/**
 * Fetch all of a device's contacts
 * @param {string} cli - device CLI
 * @return {ComputedRef<DeviceContact[]>} - An array containing all the device's contacts
 */
export function deviceContacts(cli: string): ComputedRef<DeviceContact[]> {
  const queryResult = subscribeToQuery(DEVICE_CONTACTS, { cli }) as Ref<
    Record<string, unknown>[]
  >;
  return computed(() => mapContacts(queryResult.value ?? []));
}

/**
 * Fetch all the user's devices' contacts
 * @return {ComputedRef<DeviceContact[]>} - An array containing all the user's contacts
 */
export function myContacts(): ComputedRef<DeviceContact[]> {
  const queryResult = subscribeToQuery(MY_CONTACTS) as Ref<
    Record<string, unknown>[]
  >;
  return computed(() => mapContacts(queryResult.value ?? []));
}

/**
 * Map contact records to contact instances.
 * @param {Record<string, unknown>[]} records - contact records.
 * @returns {DeviceContact[]} - contact instances.
 */
export function mapContacts(
  records: Record<string, unknown>[]
): DeviceContact[] {
  return records.map((record) => mapContact(record));
}

/**
 * Map contact record to contact instance.
 * @param {Record<string, unknown>} record - contact record.
 * @returns {DeviceContact} - contact instance.
 */
export function mapContact(record: Record<string, unknown>): DeviceContact {
  return new DeviceContact(
    record.id as string,
    record.cli as string,
    record.name as string,
    record.email as string,
    record.phone as string,
    record.event as boolean,
    record.alarm1 as boolean,
    record.alarm2 as boolean,
    record.smsLimit as boolean,
    record.power as boolean,
    record.memory as boolean,
    record.daily as boolean
  );
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
    record.phone as string,
    new Date(record.birthdate as string),
    record.projects as Project[],
    record.devices as string[]
  );
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
    record.devices as string[]
  );
}

/**
 * Map device records to device instances.
 * @param {Record<string, unknown>[]} records - device records.
 * @returns {Device[]} - device instances.
 */
export function mapDevices(records: Record<string, unknown>[]): Device[] {
  return records.map((record) => mapDevice(record));
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
    (record.pid as string) ?? '-',
    record.ftp as boolean,
    (record.ip as string) ?? '-',
    record.firmware as string,
    record.deviceType as 'MR2000' | 'MR3000'
  );
}
