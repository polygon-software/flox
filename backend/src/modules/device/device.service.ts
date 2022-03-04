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
    if (deviceId.includes('_')) {
      // MR3000
      const mr3000instances = await fetchFromTable(
        'MR3000',
        'para_trigala',
        filterQuery,
      );
      const instance = mr3000instances[0];
      return new DeviceParams(
        instance.trigX,
        instance.trigY,
        instance.trigZ,
        instance.ala1X,
        instance.ala1Y,
        instance.ala1Z,
        instance.ala2X,
        instance.ala2Y,
        instance.ala2Z,
        instance.unitX,
        instance.unitY,
        instance.unitZ,
      );
    } else {
      // MR2000
      const mr2000instances = await fetchFromTable(
        'MR2000',
        'param',
        filterQuery,
      );
      const instance = mr2000instances[0];
      // TODO: Ask customer if multiply by lsb is necessary
      // return new DeviceParams(
      //   instance.trigX * instance.lsbX,
      //   instance.trigY * instance.lsbY,
      //   instance.trigZ * instance.lsbZ,
      //   instance.ala1X * instance.lsbX,
      //   instance.ala1Y * instance.lsbY,
      //   instance.ala1Z * instance.lsbZ,
      //   instance.ala2X * instance.lsbX,
      //   instance.ala2Y * instance.lsbY,
      //   instance.ala2Z * instance.lsbZ,
      //   instance.unitX,
      //   instance.unitY,
      //   instance.unitZ,
      // );
      return new DeviceParams(
        instance.trigX,
        instance.trigY,
        instance.trigZ,
        instance.ala1X,
        instance.ala1Y,
        instance.ala1Z,
        instance.ala2X,
        instance.ala2Y,
        instance.ala2Z,
        instance.unitX,
        instance.unitY,
        instance.unitZ,
      );
    }
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
