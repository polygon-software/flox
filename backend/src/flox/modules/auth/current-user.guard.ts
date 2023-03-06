import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { getRequest } from '../../core/flox-helpers';
import { DefaultRoles } from '../roles/config';

import User from './entities/user.entity';
import GetUserArgs from './dto/args/get-user.args';
import UserService from './user.service';

/**
 * This guard is technically an interceptor, bu it needs to be a guard
 * due to the fact that - in the global execution lifecycle - guards
 * are executed before interceptors, and since our guards need access to the
 * principal, we need to abuse a guard here to fit before other guards
 * executions. Sad but true.
 */
@Injectable()
export default class CurrentUserGuard implements CanActivate {
  /**
   * @param userService - user service, needed to retrieve user from database
   */
  constructor(private readonly userService: UserService) {}

  /**
   * Gets the request from context
   *
   * @param context - execution context of the request
   * @returns the request
   */
  getRequest(context: ExecutionContext): ReturnType<typeof getRequest> {
    return getRequest(context);
  }

  /**
   * Interceptor to set the request application principal
   *
   * @param context - request execution context
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = this.getRequest(context);
    const { user } = req;
    let dbUser: User | undefined;

    // Set user in request object
    if (user) {
      dbUser = await this.userService.getUser({
        cognitoUuid: user.UUID,
      } as GetUserArgs);

      // Handle the case in which an alias is provided in header
      const alias = req.headers['user-alias'];
      if (dbUser.role === DefaultRoles.ADMIN && alias) {
        try {
          dbUser = await this.userService.getUser({
            uuid: alias,
          } as GetUserArgs);
        } catch (e) {
          throw new BadRequestException('Invalid alias');
        }
      }

      // Set either cognito user or alias user as principal to request
      req.principal = dbUser;
    }

    return true;
  }
}
