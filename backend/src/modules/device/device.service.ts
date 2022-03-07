import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, Observable } from 'rxjs';
import { LevelWritingPoint } from '../../types/LevelWritingPoint';
import { LevelWriting } from '../../types/LevelWriting';
import { LevelWritingAxis } from '../../types/LevelWritingAxis';
import { GetLevelWritingArgs } from './dto/args/get-level-writing.args';
import { ConfigService } from '@nestjs/config';
import { fetchFromTable } from '../../helpers/database-helpers';
import { EventsTableRow } from '../../types/EventsTableRow';

@Injectable()
export class DeviceService {
  constructor(
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
   * gets events
   * @param {string} clientId - Id of client
   * @returns {Promise<EventsTableRow[]>} - table Rows
   */
  async getEvents(clientId: string): Promise<EventsTableRow[]> {
    const typeMapping = {
      n: 'Evt',
      p: 'Pk',
      Z: 'ZIP',
    };
    if (clientId.includes('-')) {
      const mr2000 = await fetchFromTable(
        'MR2000',
        'events',
        `WHERE cli='${clientId}' ORDER by rec_time DESC`,
      );
      return mr2000.map((item) => {
        const file = item['num'];
        const type = typeMapping[item['typ'].toLowerCase()];
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
      });
    }

    const frequencyAvailable = await fetchFromTable(
      'MR3000',
      'pk_frq',
      `WHERE ident LIKE '${clientId}.%'`,
    );
    console.log(frequencyAvailable);
    let mr3000 = [];
    if (frequencyAvailable.length > 0) {
      console.log('frequency available');
      mr3000 = await fetchFromTable(
        'MR3000',
        'events JOIN pk_frq ON events.ident=pk_frq.ident ',
        `WHERE events.cli='${clientId}' ORDER by rec_time DESC`,
      );
    } else {
      console.log('frequency not available');
      mr3000 = await fetchFromTable(
        'MR3000',
        'events',
        `WHERE cli='${clientId}' ORDER by rec_time DESC`,
      );
    }

    return mr3000.map((item) => {
      const file = item['num'];
      const type = typeMapping[item['typ'].toLowerCase()];
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
      if (frequencyAvailable.length > 0) {
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
    });
  }
}
