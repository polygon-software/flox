import { Args, Query, Resolver } from '@nestjs/graphql';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { DeviceService } from './device.service';
import {
  AdminOnly,
  AnyRole,
  CurrentUser,
} from '../../auth/authorization.decorator';
import { Device } from '../../types/Device';
import { GetUserDevicesArgs } from './dto/args/get-user-devices.args';
import { GetMyDevicesArgs } from './dto/args/get-my-devices.args';
import { GetUserArgs } from '../user/dto/args/get-user.args';

@Resolver(() => User)
export class DeviceResolver {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly userService: UserService,
  ) {}

  /**
   * Returns a list of a given user's MR2000 & MR3000 devices
   * @param {GetUserDevicesArgs} getUserDevicesArgs - contains user's UUID
   * @returns {Promise<Device[]>} - the user's devices
   */
  @AdminOnly()
  @Query(() => [Device], { name: 'getUserDevices' })
  async getUserDevices(@Args() getUserDevicesArgs: GetUserDevicesArgs) {
    return this.deviceService.getUserDevices(getUserDevicesArgs);
  }

  /**
   * Returns a list of the current user's devices
   * @param {Record<string, string>}  user - currently logged-in user from request
   * @param {GetMyDevicesArgs} [getMyDevicesArgs] - arguments containing whether to return only unassigned devices
   * @returns {Promise<Project[]>} - the user's projects
   */
  @AnyRole()
  @Query(() => [Device], { name: 'myDevices' })
  async myDevices(
    @CurrentUser() user: Record<string, string>,
    @Args() getMyDevicesArgs?: GetMyDevicesArgs,
  ) {
    // Get user
    const dbUser = await this.userService.getUser({
      cognitoUuid: user.userId,
    } as GetUserArgs);

    if (!dbUser) {
      throw new Error(`No user found for ${user.userId}`);
    }
    return this.deviceService.getUserDevices({
      uuid: dbUser.uuid,
      unassigned: getMyDevicesArgs?.unassigned ?? false,
      assigned: getMyDevicesArgs?.assigned ?? false,
    } as GetUserDevicesArgs);
  }
}
