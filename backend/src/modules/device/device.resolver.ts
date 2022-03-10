import { Args, Query, Resolver } from '@nestjs/graphql';
import { DeviceService } from './device.service';
import { GetLevelWritingArgs } from './dto/args/get-level-writing.args';
import { LevelWriting } from '../../types/LevelWriting';
import { AnyRole, CurrentUser } from '../../auth/authorization.decorator';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { DeviceParams } from '../../types/DeviceParams';
import { GetDeviceParamsArgs } from './dto/args/get-device-params.args';

@Resolver()
export class DeviceResolver {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly userService: UserService,
  ) {}

  /**
   * Get the level writings for multiple devices if the user has permission.
   * @param {GetLevelWritingArgs} getLevelWritingArgs - StationIds, start, end & resolution
   * @param {Record<string, string>} user - Cognito user from request.
   * @returns {Promise<LevelWriting>} - The level writings of the devices.
   */
  @AnyRole()
  @Query(() => LevelWriting, { name: 'levelWriting' })
  async getLevelWriting(
    @Args() getLevelWritingArgs: GetLevelWritingArgs,
    @CurrentUser() user: Record<string, string>,
  ): Promise<LevelWriting> {
    const dbUser = await this.userService.getMyUser(user);
    getLevelWritingArgs.clients.forEach((stationId) => {
      if (!this.userService.isAuthorizedForDevice(dbUser, stationId)) {
        throw new UnauthorizedException();
      }
    });

    return this.deviceService.getLevelWriting(getLevelWritingArgs);
  }

  /**
   * Get the device parameters if the user has permission.
   * @param {GetDeviceParamsArgs} getDeviceParamsArgs - StationId
   * @param {Record<string, string>} user - Cognito user from request.
   * @returns {Promise<DeviceParams>} - The parameters of the device.
   */
  @AnyRole()
  @Query(() => DeviceParams, { name: 'deviceParams' })
  async getDeviceParams(
    @Args() getDeviceParamsArgs: GetDeviceParamsArgs,
    @CurrentUser() user: Record<string, string>,
  ): Promise<DeviceParams> {
    const dbUser = await this.userService.getMyUser(user);
    if (
      !this.userService.isAuthorizedForDevice(dbUser, getDeviceParamsArgs.cli)
    ) {
      throw new UnauthorizedException();
    }
    return this.deviceService.getDeviceParams(getDeviceParamsArgs);
  }
}
