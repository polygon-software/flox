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

  async getDeviceParams(
    getDeviceParamsArgs: GetDeviceParamsArgs,
  ): Promise<DeviceParams> {
    const deviceId = getDeviceParamsArgs.stationId;
    const filterQuery = `WHERE cli = "${deviceId}"`;
    let instances: Record<string, string | number>[];
    if (deviceId.includes('_')) {
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
}
