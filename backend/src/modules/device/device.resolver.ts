import { Args, Query, Resolver } from '@nestjs/graphql';
import { DeviceService } from './device.service';
import { GetLevelWritingArgs } from './dto/args/get-level-writing.args';
import { LevelWriting } from '../../types/LevelWriting';
import { AnyRole } from '../../auth/authorization.decorator';

@Resolver()
export class DeviceResolver {
  constructor(private readonly devicesService: DeviceService) {}

  @AnyRole()
  @Query(() => LevelWriting, { name: 'levelWriting' })
  getLevelWriting(@Args() getLevelWritingArgs: GetLevelWritingArgs) {
    return this.devicesService.getLevelWriting(getLevelWritingArgs);
  }
}
