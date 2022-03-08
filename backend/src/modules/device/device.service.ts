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

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
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

    // Fetch stores for FTP info
    const mr2000store = await fetchFromTable('MR2000', 'store_mr');
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
}
