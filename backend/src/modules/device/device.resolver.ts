import { Args, Query, Resolver } from '@nestjs/graphql';
import { DeviceService } from './device.service';
import { GetLevelWritingArgs } from './dto/args/get-level-writing.args';
import { LevelWriting } from '../../types/LevelWriting';
import { AnyRole, CurrentUser } from '../../auth/authorization.decorator';
import { UserService } from '../user/user.service';
import { ROLE } from '../../ENUM/ENUM';
import { UnauthorizedException } from '@nestjs/common';

@Resolver()
export class DeviceResolver {
  constructor(
    private readonly devicesService: DeviceService,
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
      return this.devicesService.getLevelWriting(getLevelWritingArgs);
    }

    throw new UnauthorizedException();
  }
}
