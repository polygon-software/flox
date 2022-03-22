import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { GetUserDevicesArgs } from './dto/args/get-user-devices.args';
import {
  mr2000fromDatabaseEntry,
  mr3000fromDatabaseEntry,
  deviceType,
  deviceContactFromDatabaseEntry,
  connectionLogEntryFromDatabaseEntry,
  mapDeviceLogEntry,
} from '../../helpers/device-helpers';
import { Project } from '../project/entities/project.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, Observable } from 'rxjs';
import { LevelWritingPoint } from '../../types/LevelWritingPoint';
import { LevelWriting } from '../../types/LevelWriting';
import { LevelWritingAxis } from '../../types/LevelWritingAxis';
import { GetLevelWritingArgs } from './dto/args/get-level-writing.args';
import { ConfigService } from '@nestjs/config';
import {
  deleteInTable,
  fetchCountFromTable,
  fetchFromTable,
  insertIntoTable,
  updateInTable,
} from '../../helpers/database-helpers';
import { EventsTableRow } from '../../types/EventsTableRow';
import { GetEventTableArgs } from './dto/args/get-event-table.args';
import { EventsTable } from '../../types/EventsTable';
import { DeviceParams } from '../../types/DeviceParams';
import { GetDeviceParamsArgs } from './dto/args/get-device-params.args';
import { GetConnectionLogsArgs } from './dto/args/get-connection-logs.args';
import { GetDeviceLogArgs } from './dto/args/get-device-log.args';
import { MR2000 } from '../../types/MR2000';
import { DeviceLog } from '../../types/DeviceLog';
import { AddContactToDeviceInput } from './dto/input/add-contact-to-device.input';
import { EditContactInput } from './dto/input/edit-contact.input';
import { DeleteContactInput } from './dto/input/delete-contact.input';

@Injectable()
export class DeviceService {
  reverseTypeMapping = {
    Evt: 'n',
    Pk: 'p',
    ZIP: 'Z',
  };
  typeMapping = {
    n: 'Evt',
    p: 'Pk',
    Z: 'ZIP',
  };
  columnMapping = {
    file: 'num',
    type: 'typ',
    date_time: 'rec_time',
    peakX: 'peakX',
    peakY: 'peakY',
    peakZ: 'peakZ',
    frequencyX: 'frqX',
    frequencyY: 'frqY',
    frequencyZ: 'frqZ',
    VSUM: 'VSUM',
  };

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get the parameters for a device. The parameters are Trigger, Alarm1, Alarm2 and Unit for all three axes.
   * @param {GetDeviceParamsArgs} getDeviceParamsArgs - client.
   * @returns {Promise<DeviceParams>} - the parameters for the device.
   */
  async getDeviceParams(
    getDeviceParamsArgs: GetDeviceParamsArgs,
  ): Promise<DeviceParams> {
    const client = getDeviceParamsArgs.cli;
    const filterQuery = `WHERE cli = "${client}"`;
    let instances: Record<string, string | number>[];
    if (deviceType(client) === 'MR3000') {
      // MR3000
      instances = await fetchFromTable('MR3000', 'para_trigala', filterQuery);
    } else {
      // MR2000
      instances = await fetchFromTable('MR2000', 'param', filterQuery);
    }
    const instance = instances[0];
    return new DeviceParams(
      instance.trigX as number,
      instance.trigY as number,
      instance.trigZ as number,
      instance.ala1X as number,
      instance.ala1Y as number,
      instance.ala1Z as number,
      instance.ala2X as number,
      instance.ala2Y as number,
      instance.ala2Z as number,
      instance.unitX as string,
      instance.unitY as string,
      instance.unitZ as string,
    );
  }

  /**
   * Get the level writings on three axis (x, y, z) for multiple stations.
   * @param {GetLevelWritingArgs} getLevelWritingArgs - stationIds, start, end and resolution
   * @returns {LevelWriting} - the level writings as a LevelWriting instance
   */
  async getLevelWriting(
    getLevelWritingArgs: GetLevelWritingArgs,
  ): Promise<LevelWriting> {
    const xAxes: LevelWritingAxis[] = [];
    const yAxes: LevelWritingAxis[] = [];
    const zAxes: LevelWritingAxis[] = [];
    let maxValue = 0;
    const startTime = getLevelWritingArgs.start.getTime();
    const endTime = getLevelWritingArgs.end.getTime();
    const resolution = getLevelWritingArgs.resolution;
    const host = this.configService.get('pyAPI.host');
    const port = this.configService.get('pyAPI.port');
    const promiseList = getLevelWritingArgs.clients.map(async (cli) => {
      const url = `http://${host}:${port}/rrt?file=${cli}&start=${startTime}&end=${endTime}&step=${resolution}`;
      try {
        const response: Observable<unknown> = this.httpService
          .get(url)
          .pipe(map((axiosResponse) => axiosResponse.data));
        const data = await firstValueFrom(response);
        const step = data[0][2] * 1000; // ms
        const values = data[2] as Array<Array<number>>;
        let currentStep = 0;
        const xPoints: LevelWritingPoint[] = [];
        const yPoints: LevelWritingPoint[] = [];
        const zPoints: LevelWritingPoint[] = [];
        values.forEach((value) => {
          const time = startTime + currentStep;
          currentStep += step;
          maxValue = Math.max(maxValue, ...value);
          xPoints.push(new LevelWritingPoint(new Date(time), value[0]));
          yPoints.push(new LevelWritingPoint(new Date(time), value[1]));
          zPoints.push(new LevelWritingPoint(new Date(time), value[2]));
        });
        xAxes.push(new LevelWritingAxis(cli, xPoints));
        yAxes.push(new LevelWritingAxis(cli, yPoints));
        zAxes.push(new LevelWritingAxis(cli, zPoints));
      } catch (e) {
        console.error(
          `Level Writings for station "${cli}" not found! URL: ${url}`,
        );
      }
    });
    await Promise.all(promiseList);
    return new LevelWriting(xAxes, yAxes, zAxes, maxValue);
  }

  /**
   * Returns a list of the user's MR2000 & MR3000 devices
   * @param {GetUserDevicesArgs} getUserDevicesArgs - contains user's UUID
   * @returns {Promise<MR2000|MR3000[]>} - the user's devices
   */
  async getUserDevices(getUserDevicesArgs: GetUserDevicesArgs) {
    // Get user
    const user = await this.userRepository.findOne(getUserDevicesArgs.uuid);

    if (!user) {
      throw new Error(`No user found for ${getUserDevicesArgs.uuid}`);
    }

    // Get all MR2000 & MR3000 instances
    const mr2000instances = await fetchFromTable('MR2000', 'station');
    const mr3000instances = await fetchFromTable('MR3000', 'station');

    // Fetch stores for FTP info
    const mr2000store = await fetchFromTable('MR2000', 'store');
    const mr3000store = await fetchFromTable('MR3000', 'store');

    // Fetch VPN table for FTP info
    const vpnInfo = await fetchFromTable('openvpn', 'tempovp');

    let devices = [];

    // Add all allowed MR2000 instances
    for (const instance of mr2000instances) {
      if ((user.mr2000instances ?? []).includes(instance.cli)) {
        const mr2000 = await mr2000fromDatabaseEntry(
          instance,
          this.projectRepository,
          vpnInfo.find((vpnEntry) => vpnEntry.cli === instance.cli),
          mr2000store.find((storeEntry) => storeEntry.cli === instance.cli),
        );
        devices.push(mr2000);
      }
    }

    // Add all allowed MR3000 instances
    for (const instance of mr3000instances) {
      if ((user.mr3000instances ?? []).includes(instance.cli)) {
        const mr3000 = await mr3000fromDatabaseEntry(
          instance,
          this.projectRepository,
          vpnInfo.find((vpnEntry) => vpnEntry.cli === instance.cli),
          mr3000store.find((storeEntry) => storeEntry.cli === instance.cli),
        );
        devices.push(mr3000);
      }
    }

    // Filter based on unassigned/assigned setting
    if (getUserDevicesArgs.unassigned) {
      devices = devices.filter((device) => !device.project);
    }
    if (getUserDevicesArgs.assigned) {
      devices = devices.filter((device) => !!device.project);
    }

    return devices;
  }

  /**
   * Gets events for a given cli
   * @param {GetEventTableArgs} getEventArgs - Id of client
   * @returns {Promise<EventsTableRow[]>} - table Rows
   */
  async getEvents(getEventArgs: GetEventTableArgs): Promise<EventsTable> {
    const cli = getEventArgs.cli;

    // Get number of items in database by type
    const lengthAll = await this.getEventsLength(cli);
    const lengthEvt = await this.getEventsLength(cli, 'Evt');
    const lengthPk = await this.getEventsLength(cli, 'Pk');
    const lengthZip = await this.getEventsLength(cli, 'ZIP');

    // Where clause for filtering by cli and typ
    let filterQuery = `WHERE events.cli='${cli}'`;
    if (getEventArgs.filter && getEventArgs.filter !== 'All') {
      filterQuery += ` AND events.typ='${
        this.reverseTypeMapping[getEventArgs.filter]
      }'`;
    }

    // Order by clause
    let orderBy = this.columnMapping[getEventArgs.orderBy] || 'rec_time';
    orderBy += ` ${getEventArgs.descending ? 'DESC' : 'ASC'}`;

    // MR2000
    if (deviceType(cli) === 'MR2000') {
      // MR2000 can't order by these
      if (
        ['frqX', 'frqY', 'frqZ', 'frqZ'].some((item) => {
          return orderBy.startsWith(item);
        })
      ) {
        orderBy = 'rec_time';
      }
      const mr2000 = await fetchFromTable(
        'MR2000',
        'events',
        `${filterQuery} ORDER BY ${orderBy}
        LIMIT ${getEventArgs.skip}, ${getEventArgs.take}`,
      );
      const res = mr2000.map((item) => {
        return this.mapMR2000(item, cli);
      });
      return new EventsTable(lengthAll, lengthZip, lengthEvt, lengthPk, res);
    }

    // MR3000
    const frequencyAvailable = await fetchFromTable(
      'MR3000',
      'pk_frq',
      `WHERE ident LIKE '${cli}.%'`,
    );
    let mr3000 = [];
    if (frequencyAvailable.length > 0) {
      mr3000 = await fetchFromTable(
        'MR3000',
        'events JOIN pk_frq ON events.ident=pk_frq.ident ',
        `${filterQuery} ORDER BY ${orderBy}
        LIMIT ${getEventArgs.skip}, ${getEventArgs.take}`,
      );
    } else {
      mr3000 = await fetchFromTable(
        'MR3000',
        'events',
        `${filterQuery} ORDER BY ${orderBy}
        LIMIT ${getEventArgs.skip}, ${getEventArgs.take}`,
      );
    }

    const res = mr3000.map((item) => {
      return this.mapMR3000(item, cli, frequencyAvailable.length > 0);
    });
    return new EventsTable(lengthAll, lengthZip, lengthEvt, lengthPk, res);
  }

  /**
   * count(*) Query with filter clause
   * @param {string} clientId - client id
   * @param {string} type - Evt, Pk or Zip
   * @returns {int} - number of entries
   */
  async getEventsLength(clientId: string, type = ''): Promise<number> {
    const database = deviceType(clientId);
    const typeClause =
      type === '' ? '' : `AND typ='${this.reverseTypeMapping[type]}'`;
    const res = await fetchCountFromTable(
      database,
      'events',
      `WHERE cli='${clientId}' ${typeClause}`,
    );
    return res[0]['count(*)'];
  }

  /**
   * Map entries into EventTableRow for MR2000 events
   * @param {Record<string, unknown>} item - db table row
   * @param {string} clientId - client id
   * @returns {EventsTableRow} - res
   */
  mapMR2000(item, clientId) {
    const file = item['num'];
    const type = this.typeMapping[item['typ'].toLowerCase()];
    const dateTime = new Date(item['rec_time']);
    const peakX = `${item['peakX']} ${item['unitX']}`;
    const peakY = `${item['peakY']} ${item['unitY']}`;
    const peakZ = `${item['peakZ']} ${item['unitZ']}`;
    const timeStamp = dateTime.getTime() / 1000;
    let downloadURL = null;
    let previewURL = null;
    let fileName = null;
    if (item['filenam'] !== 'no') {
      downloadURL = `../download.cgi/?client=${clientId}&num=${item['num']}&token=${timeStamp}`;
      fileName = item['filenam'].split('/').pop();
    }
    if (item['filenam'] === 'unavail') {
      downloadURL = '';
    }
    if (type === 'Evt') {
      previewURL = `../preview.cgi/?client=${clientId}&num=${item['num']}&token=${timeStamp}`;
    }
    return new EventsTableRow(
      file,
      type,
      dateTime,
      peakX,
      peakY,
      peakZ,
      downloadURL,
      fileName,
      previewURL,
      null,
      null,
      null,
      null,
    );
  }

  /**
   * Map entries into EventTableRow for MR3000 events
   * @param {Record<string, unknown>} item - db table row
   * @param {string} clientId - client id
   * @param {boolean} frequencyAvailable - Whether frequency data is available
   * @returns {EventsTableRow} - res
   */
  mapMR3000(item, clientId, frequencyAvailable) {
    const file = item['num'];
    const type = this.typeMapping[item['typ'].toLowerCase()];
    const dateTime = new Date(item['rec_time']);
    const peakX = `${item['peakX']} ${item['unitX']}`;
    const peakY = `${item['peakY']} ${item['unitY']}`;
    const peakZ = `${item['peakZ']} ${item['unitZ']}`;
    const timeStamp = dateTime.getTime() / 1000;

    const downloadURL = `../download.cgi/?client=${clientId}&num=${item['num']}&token=${timeStamp}`;
    const fileName = item['filenam'].split('/').pop();
    let previewURL = null;

    if (type === 'Evt') {
      previewURL = `../preview.cgi/?client=${clientId}&num=${item['num']}&token=${timeStamp}`;
    }
    let frequencyX = null;
    let frequencyY = null;
    let frequencyZ = null;
    let VSUM = null;
    if (frequencyAvailable) {
      frequencyX = item['frqX'];
      frequencyY = item['frqY'];
      frequencyZ = item['frqZ'];
      VSUM = item['VSUM'];
    }

    return new EventsTableRow(
      file,
      type,
      dateTime,
      peakX,
      peakY,
      peakZ,
      downloadURL,
      fileName,
      previewURL,
      frequencyX,
      frequencyY,
      frequencyZ,
      VSUM,
    );
  }

  /**
   * Get a device (MR2000 or MR3000) by CLI
   * @param {string} cli - Client ID
   * @returns {Promise<Device>} - The device
   */
  async getDeviceByCli(cli: string) {
    const type = deviceType(cli);
    const instances = await fetchFromTable(
      type,
      'station',
      `WHERE cli='${cli}'`,
    );
    const instance = instances[0];

    if (!instance) {
      throw new Error(`No device found for CLI ${cli}`);
    }

    if (type === 'MR2000') {
      return mr2000fromDatabaseEntry(instance, this.projectRepository, null);
    }

    return mr3000fromDatabaseEntry(instance, this.projectRepository, null);
  }

  /**
   * Adds a contact to a given device (either on table 'alert' or 'para_alert')
   * @param {AddContactToDeviceInput} addContactToDeviceInput - input, containing all contact info
   * @returns {Promise<Device>} - the device on which the new contact was added
   */
  async addContactToDevice(addContactToDeviceInput: AddContactToDeviceInput) {
    // Determine device type for table name
    const type = deviceType(addContactToDeviceInput.cli);
    const table = type === 'MR2000' ? 'alert' : 'para_alert';

    const input = addContactToDeviceInput;

    // Base record (fields that are identical for MR2000 and MR3000
    let record: Record<string, unknown> = {
      cli: input.cli,
      name: input.name,
      email: input.email,
      phone: input.phone,
      daily: input.daily,
      soh_power: input.power,
      soh_sms_limit: input.smsLimit,
    };

    if (type === 'MR2000') {
      // MR2000
      record = {
        ...record,
        id: 'no_id',
        event: input.event,
        alarm1: input.alarm1,
        alarm2: input.alarm2,
      };
    } else {
      // MR3000
      record = {
        ...record,
        status: 0,
        event_all: input.event,
        event_alarm1: input.alarm1,
        event_alarm2: input.alarm2,
        soh_sdcard: input.memory,
      };
    }

    // Write to database
    await insertIntoTable(type, table, record);

    // Get device where contact was added
    return this.getDeviceByCli(input.cli);
  }

  /**
   * Edits a given device contact
   * @param {EditContactInput} editContactInput - input, containing all info to update
   * @returns {Promise<Device>} - the device on which the contact was edited
   */
  async editContact(editContactInput: EditContactInput) {
    // Determine device type for table name
    const type = deviceType(editContactInput.cli);
    const table = type === 'MR2000' ? 'alert' : 'para_alert';

    const input = editContactInput;

    // Base record (fields that are identical for MR2000 and MR3000)
    let record: Record<string, unknown> = {
      name: input.name,
      email: input.email,
      phone: input.phone,
      daily: input.daily,
      soh_power: input.power,
      soh_sms_limit: input.smsLimit,
    };

    if (type === 'MR2000') {
      // MR2000
      record = {
        ...record,
        event: input.event,
        alarm1: input.alarm1,
        alarm2: input.alarm2,
      };
    } else {
      // MR3000
      record = {
        ...record,
        status: 0,
        event_all: input.event,
        event_alarm1: input.alarm1,
        event_alarm2: input.alarm2,
        soh_sdcard: input.memory,
      };
    }

    const filterQuery =
      type === 'MR2000'
        ? `WHERE uniq_id='${editContactInput.id}'`
        : `WHERE rec_id='${editContactInput.id}'`;

    // Write to database
    await updateInTable(type, table, filterQuery, record);

    // Get device where contact was edited
    return this.getDeviceByCli(input.cli);
  }

  /**
   * Deletes a given device contact
   * @param {DeleteContactInput} deleteContactInput - input, containing ID and CLI
   * @returns {Promise<Device>} - the device on which the contact was deleted
   */
  async deleteContact(deleteContactInput: DeleteContactInput) {
    // Determine device type for table name
    const type = deviceType(deleteContactInput.cli);
    const table = type === 'MR2000' ? 'alert' : 'para_alert';

    const filterQuery =
      type === 'MR2000'
        ? `WHERE uniq_id='${deleteContactInput.id}'`
        : `WHERE rec_id='${deleteContactInput.id}'`;

    // Write to database
    await deleteInTable(type, table, filterQuery);

    // Get device where contact was deleted
    return this.getDeviceByCli(deleteContactInput.cli);
  }

  /**
   * Gets the contacts for a device by CLI
   * @param {string} cli - Client ID
   * @returns {Promise<DeviceContact[]>} - The device's contacts
   */
  async getDeviceContacts(cli: string) {
    const type = deviceType(cli);
    const instances =
      (await fetchFromTable(
        type,
        type === 'MR2000' ? 'alert' : 'para_alert',
        `WHERE cli='${cli}'`,
      )) ?? [];

    return instances.map((instance) =>
      deviceContactFromDatabaseEntry(instance),
    );
  }

  /**
   * Get the connection logs for a given device
   * @param {GetConnectionLogsArgs} getConnectionLogsArgs - args, containing CLI and number of entries to get
   * @returns {int} - number of entries
   */
  async getConnectionLogs(getConnectionLogsArgs: GetConnectionLogsArgs) {
    const tableEntries = await fetchFromTable(
      'openvpn',
      'logovp',
      `WHERE cli='${getConnectionLogsArgs.cli}'
      ORDER BY timestamp DESC
      LIMIT ${getConnectionLogsArgs.skip}, ${getConnectionLogsArgs.take}`,
    );

    // Map to actual type & return
    return tableEntries.map((tableEntry) =>
      connectionLogEntryFromDatabaseEntry(tableEntry),
    );
  }

  /**
   * Get the total number of connection logs for a given device
   * @param {string} cli - device CLI
   * @returns {int} - number of entries
   */
  async getConnectionLogCount(cli: string) {
    const numberOfLogs = await fetchCountFromTable(
      'openvpn',
      'logovp',
      `WHERE cli='${cli}'`,
    );

    return numberOfLogs[0]['count(*)'];
  }

  /**
   * Get the log entries for a given device
   * @param {GetDeviceLogArgs} getDeviceLogArgs - args, containing CLI
   * @returns {Promise<DeviceLog>} - log entries
   */
  async getDeviceLog(getDeviceLogArgs: GetDeviceLogArgs) {
    const type = deviceType(getDeviceLogArgs.cli);

    // File path & name, based on device type
    const filePath = `${type === 'MR2000' ? 'LOG_2000' : 'LOG_3K'}`;
    let fileName;

    if (type === 'MR2000') {
      // MR2000: Only basic log files (.txt)
      fileName = `${getDeviceLogArgs.cli}-log.txt`;
    } else {
      // MR3000: Log type with prefix (if any)
      fileName = getDeviceLogArgs.prefix
        ? `${getDeviceLogArgs.prefix}_${getDeviceLogArgs.cli}`
        : `${getDeviceLogArgs.cli}`;
    }

    // Fetch from filesystem via Python API
    const host = this.configService.get('pyAPI.host');
    const port = this.configService.get('pyAPI.port');
    const url = `http://${host}:${port}/log?path=${filePath}&file=${fileName}&skip=${getDeviceLogArgs.skip}&take=${getDeviceLogArgs.take}`;
    try {
      const response: Observable<unknown> = this.httpService
        .get(url)
        .pipe(map((axiosResponse) => axiosResponse.data));
      const data = (await firstValueFrom(response)) as Record<string, unknown>;
      console.log('got data', data);
      const total = data.total as number;
      const entries = (data.entries as string[]).map((dataRow) =>
        mapDeviceLogEntry(dataRow),
      );
      return new DeviceLog(total, entries);
    } catch (e) {
      console.log(e);
      // No logs found; return empty
      return new DeviceLog(0, []);
    }
  }
}
