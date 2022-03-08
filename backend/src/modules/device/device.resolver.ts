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
import { GetLevelWritingArgs } from './dto/args/get-level-writing.args';
import { LevelWriting } from '../../types/LevelWriting';
import { ROLE } from '../../ENUM/ENUM';
import { UnauthorizedException } from '@nestjs/common';

@Resolver(() => User)
export class DeviceResolver {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly userService: UserService,
  ) {}

  /**
   * Get the level writings for multiple devices if the user has permission.
   * @param {GetLevelWritingArgs} getLevelWritingArgs - StationIds, start, end & resolution
   * @param {Record<string, string>} user - cognito user from request.
   * @returns {Promise<LevelWriting>} - The level writings of the devices.
   */
  @AnyRole()
  @Query(() => LevelWriting, { name: 'levelWriting' })
  async getLevelWriting(
    @Args() getLevelWritingArgs: GetLevelWritingArgs,
    @CurrentUser() user: Record<string, string>,
  ): Promise<LevelWriting> {
    const dbUser = await this.userService.getMyUser(user);
    let allowed = false;
    if (dbUser.role === ROLE.USER) {
      allowed = true;
      getLevelWritingArgs.stationIds.forEach((stationId) => {
        if (
          !dbUser.mr2000instances?.includes(stationId) &&
          !dbUser.mr3000instances?.includes(stationId)
        ) {
          allowed = false;
        }
      });
    }

    if (dbUser.role === ROLE.ADMIN || allowed) {
      return this.deviceService.getLevelWriting(getLevelWritingArgs);
    }

    throw new UnauthorizedException();
  }

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
