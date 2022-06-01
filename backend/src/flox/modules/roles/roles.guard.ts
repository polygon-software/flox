import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ANY_ROLE_KEY } from './authorization.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { getRequest } from 'src/flox/core/flox-helpers';
import { IS_PUBLIC_KEY } from '../auth/authentication.decorator';

/**
 * Guard used for defining which roles can access a specific method
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Gets the request from context
   * @param {ExecutionContext} context - request execution context
   * @returns {any} - the request
   */
  getRequest(context: ExecutionContext): any {
    return getRequest(context);
  }

  /**
   * Validate that the user has appropriate rights to activate API endpoint.
   * @param {ExecutionContext} context - context
   * @returns {boolean | Promise<boolean>} - can activate
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('ROLEs canActivate');
    const isPublic = this.isPublic(context);
    if (isPublic) {
      return true;
    }

    // Dev mode: overrides user management:
    const accessOverride = process.env.DEV === 'true';
    const requestedFunction = context.getHandler().name;

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const req = this.getRequest(context) as Record<string, unknown>;
    const user = req.user as Record<string, string>;
    let dbUser: User | undefined = undefined;
    if (user) {
      dbUser = await this.userRepository.findOne({ cognitoUuid: user.userId });

      // Admin has access to everything TODO add with role field
      // if (dbUser && dbUser.role === ROLE.ADMIN) {
      //   return true;
      // }
    }

    // For generally accessible resources, allow access by default if user is logged in
    const anyRole = this.isAnyRole(context, roles, dbUser);
    console.log(anyRole);
    if (anyRole) {
      return true;
    }

    if (accessOverride && !roles) {
      console.warn(
        `Debug override used to access private resource: "${requestedFunction}"!`,
      );
      return true;
    }

    if (!dbUser) {
      if (accessOverride) {
        console.warn(
          `Debug override used to access restricted resource: "${requestedFunction}" without authentication!`,
        );
        return true;
      }
      return false;
    }
    const res = roles ? roles.includes('ADMIN') : false; // TODO const res = roles ? roles.includes(dbUser.role) : false;
    if (accessOverride && !res) {
      // console.warn( TODO
      //   `Debug override used to access resource : "${requestedFunction}" restricted to ${roles?.join(
      //     ',',
      //   )} as ${dbUser.role}!`,
      // );
      return true;
    }
    return res;
  }

  /**
   * whether endpoint is Public
   * @param {ExecutionContext} context - context
   * @returns {boolean} - is public
   */
  isPublic(context: ExecutionContext) {
    // Determine if resource is public
    return (
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? false
    );
  }

  /**
   * Checks if the user is logged in and the access control is "anyRole"
   * @param {ExecutionContext} context - context
   * @param {string[]} roles - whitelisted roles
   * @param {User} dbUser - the requesting user
   * @returns {boolean} - whether any user can activate
   */
  isAnyRole(context: ExecutionContext, roles: string[], dbUser) {
    console.log('checking isAnyRole for', roles, dbUser);
    if (!roles || roles.length === 0) {
      // Determine if resource is accessible to any logged-in user
      return (
        this.reflector.getAllAndOverride<boolean>(ANY_ROLE_KEY, [
          context.getHandler(),
          context.getClass(),
        ]) && !!dbUser
      );
    }
    return false;
  }
}
