import { executeQuery, subscribeToQuery } from 'src/helpers/data-helpers';
import { ALL_USERS, EMAIL_ALLOWED, MY_USER, USER } from 'src/data/queries/USER';
import { User } from 'src/data/types/User';
import { ROLE } from 'src/data/ENUM';
import { Project } from 'src/data/types/Project';
import { MY_PROJECTS } from 'src/data/queries/PROJECT';
import {
  DEVICE_CONTACTS,
  DEVICE_PARAMS,
  EVENT_TABLE_ROWS,
  LEVEL_WRITING,
  MY_DEVICES,
  PROJECT_DEVICES,
  DEVICE_CONNECTION_LOGS,
  DEVICE_LOG,
  FTP_LOG,
  DEVICE_CONNECTION_LOG_COUNT,
} from 'src/data/queries/DEVICE';
import { Device } from 'src/data/types/Device';
import { computed, ComputedRef, ref, Ref } from 'vue';
import { DeviceContact } from 'src/data/types/DeviceContact';
import { MY_CONTACTS } from 'src/data/queries/CONTACT';
import { ConnectionLogEntry } from 'src/data/types/ConnectionLogEntry';
import { FTPLog } from 'src/data/types/FTPLog';
import { DeviceLog } from 'src/data/types/DeviceLog';

/**
 * Fetch the level writings for all stations.
 * @param {string[]} clients - client IDs
 * @param {Date} start - start of period
 * @param {Date} end - end of period
 * @returns {ComputedRef<LevelWritings>} - level writings
 */
export function fetchLevelWritings(clients: string[], start: Date, end: Date) {
  const queryResult = subscribeToQuery(LEVEL_WRITING, {
    clients: clients,
    start: start,
    end: end,
    resolution: 1,
  }) as Ref<Record<string, unknown>>;
  return computed(() => queryResult.value as LevelWritings);
}

/**
 * Fetch the device parameters for all stations.
 * @param {string[]} clients - client IDs
 * @returns {ComputedRef<Record<string, Record<string, string|number>>>} - device params
 */
export function fetchDeviceParams(clients: string[]) {
  const params: Ref<Record<string, Record<string, string | number>>> = ref({});
  clients.forEach(
    (cli: string) =>
      (params.value[cli] = (
        subscribeToQuery(DEVICE_PARAMS, { cli: cli }) as Ref<
          Record<string, unknown>
        >
      ).value as Record<string, string | number>)
  );
  return computed(() => params);
}

/**
 * Fetch if email is allowed.
 * @param {string} email - the email to check
 * @returns {Promise<boolean>} - if the email is allowed
 */
export async function emailAllowed(email: string) {
  const queryResult = await executeQuery(EMAIL_ALLOWED, { email: email });
  return queryResult.data
    ? queryResult.data[EMAIL_ALLOWED.cacheLocation]
    : false;
}

/**
 * Fetch the logged-in user.
 * @returns {Promise<User|null>} - the logged in user
 */
export async function loggedInUser() {
  const queryResult = await executeQuery(MY_USER);
  const user = (
    queryResult.data ? queryResult.data[MY_USER.cacheLocation] : null
  ) as Record<string, unknown> | null;
  return user ? mapUser(user) : null;
}

/**
 * Fetch event table rows with pagination.
 * @param {string} cli - Client ID
 * @param {Record<string, number | boolean | string>} pagination - pagination object
 * @param {string|null} search - search string
 * @returns {Promise<Record<string, Record<string, unknown>[]|number>|null>} - all rows plus metadata.
 */
export async function eventTableRows(
  cli: string,
  pagination: Record<string, number | boolean | string>,
  search: string | null
): Promise<Record<string, Record<string, unknown>[] | number> | null> {
  const queryResult = await executeQuery(EVENT_TABLE_ROWS, {
    stationId: cli,
    skip:
      ((pagination.page as number) - 1) * (pagination.rowsPerPage as number),
    take: pagination.rowsPerPage as number,
    filter: search,
    orderBy: (pagination.sortBy as string) || 'date_time',
    descending: (pagination.descending as boolean) || false,
  });
  return (
    queryResult.data ? queryResult.data[EVENT_TABLE_ROWS.cacheLocation] : null
  ) as Record<string, Record<string, unknown>[] | number> | null;
}

/**
 * Fetch connection log entries for a given device
 * @param {string} cli - device CLI
 * @param {Record<string, number | boolean | string>} pagination - pagination object
 * @return {Promise<ConnectionLogEntry[]>} - An array containing the requested number of connection log entries
 */
export async function connectionLogForDevice(
  cli: string,
  pagination: Record<string, number | boolean | string>
) {
  const queryResult = await executeQuery(DEVICE_CONNECTION_LOGS, {
    cli: cli,
    skip:
      ((pagination.page as number) - 1) * (pagination.rowsPerPage as number),
    take: pagination.rowsPerPage as number,
  });
  return mapConnectionLogEntries(
    (queryResult.data
      ? queryResult.data[DEVICE_CONNECTION_LOGS.cacheLocation]
      : []) as Record<string, unknown>[]
  );
}

/**
 * Fetch log for a given device
 * @param {string} cli - device CLI
 * @param {Record<string, number | boolean | string>} pagination - pagination object
 * @param {string} [type] - optional file type prefix for fetching other log types
 * @return {Promise<DeviceLog|null>} - Device log, containing entries and total count
 */
export async function logForDevice(
  cli: string,
  pagination: Record<string, number | boolean | string>,
  type: string | undefined
): Promise<DeviceLog | null> {
  const variables: Record<string, string | number> = {
    cli: cli,
    skip:
      ((pagination.page as number) - 1) * (pagination.rowsPerPage as number),
    take: pagination.rowsPerPage as number,
  };
  if (type) {
    variables.prefix = type;
  }
  const queryResult = await executeQuery(DEVICE_LOG, variables);
  return queryResult.data
    ? (queryResult.data[DEVICE_LOG.cacheLocation] as DeviceLog)
    : null;
}

/**
 * Fetch FTP log for a given device
 * @param {string} cli - device CLI
 * @param {Record<string, number | boolean | string>} pagination - pagination object
 * @return {Promise<FTPLog|null>} - Device log, containing entries and total count
 */
export async function ftpLogForDevice(
  cli: string,
  pagination: Record<string, number | boolean | string>
) {
  const queryResult = await executeQuery(FTP_LOG, {
    cli: cli,
    skip:
      ((pagination.page as number) - 1) * (pagination.rowsPerPage as number),
    take: pagination.rowsPerPage as number,
  });
  return queryResult.data
    ? (queryResult.data[FTP_LOG.cacheLocation] as FTPLog)
    : null;
}

/**
 * Fetch the number of device connection log entries
 * @param {string} cli - device CLI
 * @return {ComputedRef<number>} - amount of log entries
 */
export function fetchDeviceConnectionLogCount(
  cli: string
): ComputedRef<number> {
  const queryResult = subscribeToQuery(DEVICE_CONNECTION_LOG_COUNT, { cli });
  return computed(() => (queryResult.value ?? 0) as number);
}

/**
 * Fetch all users.
 * @returns {ComputedRef<User[]>} - all users.
 */
export function fetchAllUsers(): ComputedRef<User[]> {
  const queryResult = subscribeToQuery(ALL_USERS) as Ref<
    Record<string, unknown>[]
  >;
  return computed(() => mapUsers(queryResult.value ?? []));
}

/**
 * Fetch user.
 * @param {string} userId - user UUID.
 * @returns {ComputedRef<User | null>} - user.
 */
export function fetchUser(userId: string): ComputedRef<User | null> {
  const queryResult = subscribeToQuery(USER, { uuid: userId }) as Ref<
    Record<string, unknown>
  >;
  return computed(() =>
    queryResult.value ? mapUser(queryResult.value) : null
  );
}

/**
 * Fetch own user.
 * @returns {ComputedRef<User | null>} - user.
 */
export function myUser(): ComputedRef<User | null> {
  const queryResult = subscribeToQuery(MY_USER) as Ref<Record<string, unknown>>;
  return computed(() =>
    queryResult.value ? mapUser(queryResult.value) : null
  );
}

/**
 * Fetch all projects belonging to current user
 * @return {ComputedRef<Project[]>} - An array containing all the user's projects
 */
export function myProjects(): ComputedRef<Project[]> {
  const queryResult = subscribeToQuery(MY_PROJECTS) as Ref<
    Record<string, unknown>[]
  >;
  return computed(() => mapProjects(queryResult.value ?? []));
}

/**
 * Fetch all devices that are part of a given project
 * @param {string} name - the project's name
 * @return {ComputedRef<Device[]>} - An array containing all the user's projects
 */
export function fetchProjectDevices(name: string): ComputedRef<Device[]> {
  const queryResult = subscribeToQuery(PROJECT_DEVICES, { name: name }) as Ref<
    Record<string, unknown>[]
  >;
  return computed(() => mapDevices(queryResult.value ?? []));
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

/*
 *
 * Mappings
 *
 */

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
 * Map device record to device instance.
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

/**
 * Map connectionLogEntry record to connectionLogEntry instance.
 * @param {Record<string, unknown>} record - project record.
 * @returns {Project} - project instance.
 */
export function mapConnectionLogEntry(record: Record<string, unknown>) {
  return new ConnectionLogEntry(
    record.id as number,
    record.cli as string,
    record.timestamp as Date,
    record.vpnIp as string,
    record.realIp as string,
    record.port as string,
    record.traffic as number,
    record.reason as string
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
 * Map project records to project instances.
 * @param {Record<string, unknown>[]} records - project records.
 * @returns {Project[]} - project instances.
 */
export function mapProjects(records: Record<string, unknown>[]): Project[] {
  return records.map((record) => mapProject(record));
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
 * Map connectionLogEntry records to connectionLogEntry instances.
 * @param {Record<string, unknown>[]} records - connectionLogEntry records.
 * @returns {ConnectionLogEntry[]} - connectionLogEntry instances.
 */
export function mapConnectionLogEntries(
  records: Record<string, unknown>[]
): ConnectionLogEntry[] {
  return records.map((record) => mapConnectionLogEntry(record));
}

/*
 *
 * Types
 *
 */

type LevelWritings = {
  x: Record<string, unknown>[];
  y: Record<string, unknown>[];
  z: Record<string, unknown>[];
  max: number;
};
