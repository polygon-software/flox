import { Resolver } from '@nestjs/graphql';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { DeviceService } from './device.service';

@Resolver(() => User)
export class DeviceResolver {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly userService: UserService,
  ) {}
}
