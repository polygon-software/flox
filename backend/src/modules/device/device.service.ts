import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { GetUserDevicesArgs } from './dto/args/get-user-devices.args';
import { fetchFromTable } from '../../helpers/database-helpers';
import {
  mr2000fromDatabaseEntry,
  mr3000fromDatabaseEntry,
} from '../../helpers/device-helpers';
import { Project } from '../project/entities/project.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, Observable } from 'rxjs';
import { LevelWritingPoint } from '../../types/LevelWritingPoint';
import { LevelWriting } from '../../types/LevelWriting';
import { LevelWritingAxis } from '../../types/LevelWritingAxis';
import { GetLevelWritingArgs } from './dto/args/get-level-writing.args';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get the level writings on three axis (x, y, z) for multiple stations.
   * @param {GetLevelWritingArgs} getLevelWritingArgs - stationIds, start, end and resolution
   * @returns {LevelWriting} - the level writings as a LevelWriting instance
   */
  async getLevelWriting(
    getLevelWritingArgs: GetLevelWritingArgs,
  ): Promise<LevelWriting> {
    const x_axes: LevelWritingAxis[] = [];
    const y_axes: LevelWritingAxis[] = [];
    const z_axes: LevelWritingAxis[] = [];
    let maxValue = 0;
    const startTime = getLevelWritingArgs.start.getTime();
    const endTime = getLevelWritingArgs.end.getTime();
    const resolution = getLevelWritingArgs.resolution;
    const host = this.configService.get('pyAPI.host');
    const port = this.configService.get('pyAPI.port');
    const promiseList = getLevelWritingArgs.stationIds.map(
      async (stationId) => {
        const url = `http://${host}:${port}/rrt?file=${stationId}&start=${startTime}&end=${endTime}&step=${resolution}`;
        try {
          const response: Observable<unknown> = this.httpService
            .get(url)
            .pipe(map((response) => response.data));
          const data = await firstValueFrom(response);
          const step = data[0][2] * 1000; // ms
          const values = data[2] as Array<Array<number>>;
          let currentStep = 0;
          const x_points: LevelWritingPoint[] = [];
          const y_points: LevelWritingPoint[] = [];
          const z_points: LevelWritingPoint[] = [];
          values.forEach((value) => {
            const time = startTime + currentStep;
            currentStep += step;
            maxValue = Math.max(maxValue, ...value);
            x_points.push(new LevelWritingPoint(new Date(time), value[0]));
            y_points.push(new LevelWritingPoint(new Date(time), value[1]));
            z_points.push(new LevelWritingPoint(new Date(time), value[2]));
          });
          x_axes.push(new LevelWritingAxis(stationId, x_points));
          y_axes.push(new LevelWritingAxis(stationId, y_points));
          z_axes.push(new LevelWritingAxis(stationId, z_points));
        } catch (e) {
          console.error(
            `Level Writings for station "${stationId}" not found! URL: ${url}`,
          );
        }
      },
    );
    await Promise.all(promiseList);
    return new LevelWriting(x_axes, y_axes, z_axes, maxValue);
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

  // TODO if needed...
  // /**
  //  * Gets an MR2000/MR3000 device by CLI
  //  * @param {string} cli - device CLI
  //  * @returns {Promise<MR2000|MR3000} - the device
  //  */
  // async getDeviceByCli(cli: string) {
  //   // Get all MR2000 & MR3000 instances
  //   const mr2000instances = await fetchFromTable('MR2000', 'station');
  //   const mr3000instances = await fetchFromTable('MR3000', 'station');
  //
  //   // Fetch stores for FTP info
  //   const mr2000store = await fetchFromTable('MR2000', 'store');
  //   const mr3000store = await fetchFromTable('MR3000', 'store');
  //
  //   // Fetch VPN table for FTP info
  //   const vpnInfo = await fetchFromTable('openvpn', 'tempovp');
  //
  //   const validMr2000 = mr2000instances.find(
  //     (instance) => instance.cli === cli,
  //   );
  //
  //   // If it's a valid MR2000
  //   if (validMr2000) {
  //     return await mr2000fromDatabaseEntry(
  //       validMr2000,
  //       this.projectRepository,
  //       vpnInfo.find((vpnEntry) => vpnEntry.cli === validMr2000.cli),
  //       mr2000store.find((storeEntry) => storeEntry.cli === validMr2000.cli),
  //     );
  //   }
  //
  //   const validMr3000 = mr3000instances.find(
  //     (instance) => instance.cli === cli,
  //   );
  //
  //   // If it's a valid MR3000
  //   if (validMr3000) {
  //     return await mr3000fromDatabaseEntry(
  //       validMr3000,
  //       this.projectRepository,
  //       vpnInfo.find((vpnEntry) => vpnEntry.cli === validMr3000.cli),
  //       mr3000store.find((storeEntry) => storeEntry.cli === validMr3000.cli),
  //     );
  //   }
  //
  //   // TODO
  //   throw new Error('no thats illegal');
  // }
}
