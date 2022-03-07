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

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Returns a list of the user's MR2000 & MR3000 devices
   * @param {GetUserDevicesArgs} getUserDevicesArgs - contains user's UUID
   * @returns {Promise<MR2000|MR3000[]>} - the user's devices
   */
  async getUserDevices(getUserDevicesArgs: GetUserDevicesArgs) {
    // Get user
    const user = await this.usersRepository.findOne(getUserDevicesArgs.uuid);

    if (!user) {
      throw new Error(`No user found for ${getUserDevicesArgs.uuid}`);
    }

    // Get all MR2000 & MR3000 instances
    const mr2000instances = await fetchFromTable('MR2000', 'station');
    const mr3000instances = await fetchFromTable('MR3000', 'station');

    const devices = [];

    console.log('inst:', user.mr2000instances, user.mr3000instances);

    // Add all allowed MR2000 instances
    mr2000instances.forEach((instance) => {
      if ((user.mr2000instances ?? []).includes(instance.cli)) {
        devices.push(mr2000fromDatabaseEntry(instance));
      }
    });

    // Add all allowed MR3000 instances
    mr3000instances.forEach((instance) => {
      if ((user.mr3000instances ?? []).includes(instance.cli)) {
        devices.push(mr3000fromDatabaseEntry(instance));
      }
    });

    // Filter based on unassigned/assigned setting
    if (getUserDevicesArgs.unassigned) {
      // TODO filter
    }
    if (getUserDevicesArgs.assigned) {
      // TODO filter
    }

    return devices;
  }
}
