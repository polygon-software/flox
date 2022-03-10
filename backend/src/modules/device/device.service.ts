import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, Observable } from 'rxjs';
import { LevelWritingPoint } from '../../types/LevelWritingPoint';
import { LevelWriting } from '../../types/LevelWriting';
import { LevelWritingAxis } from '../../types/LevelWritingAxis';
import { GetLevelWritingArgs } from './dto/args/get-level-writing.args';
import { ConfigService } from '@nestjs/config';
import { DeviceParams } from '../../types/DeviceParams';
import { fetchFromTable } from '../../helpers/database-helpers';
import { GetDeviceParamsArgs } from './dto/args/get-device-params.args';

@Injectable()
export class DeviceService {
  constructor(
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
    if (client.includes('_')) {
      // TODO: Use helper function to distinguish between device types
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
}
