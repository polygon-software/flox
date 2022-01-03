import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './authentication.decorator';
import { ANY_ROLE_KEY } from './authorization.decorator';
import { getRequest } from '../helpers';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ROLE } from '../ENUM/ENUM';

/**
 * Guard used for defining which roles can access a specific method
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Gets the request from context
   * @param {ExecutionContext} context - context
   * @returns {any} - request
   */
  getRequest(context: ExecutionContext): any {
    return getRequest(context);
  }

  /**
   * Validate that the user has appropriate rights to activate API endpoint.
   * @param {ExecutionContext} context - context
   * @returns {boolean | Promise<boolean>} - can activate
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.isPublic(context);
    if (isPublic) {
      return true;
    }

    // Dev mode: overrides user management:
    const accessOverride = process.env.DEV === 'true';
    const requestedFunction = context.getHandler().name;

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const req = this.getRequest(context);
    const user = req.user;
    let dbUser = undefined;
    if (user) {
      dbUser = await this.userRepository.findOne(user.userId);

      // Admin has access to everything
      if (dbUser && dbUser.role === ROLE.ADMIN) {
        return true;
      }
    }

    const anyRole = this.isAnyRole(context, roles, dbUser);
    if (anyRole) {
      return true;
    }

    // For publicly accessible resources, allow access by default
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
    const res = roles ? roles.includes(dbUser.role) : false;
    if (accessOverride && !res) {
      console.warn(
        `Debug override used to access resource : "${requestedFunction}" restricted to ${roles?.join(
          ',',
        )} as ${dbUser.role}!`,
      );
      return true;
    }
    return res;
  }

  /**
   * Checks if any of the user's roles have access to the specified resource
   * @param {string[]} allowedRoles - the list of roles that have resource access
   * @param {string[]} userRoles - the list of the user's roles
   * @returns {boolean} - matches
   */
  matchRoles(allowedRoles: string[], userRoles: string[]): boolean {
    return userRoles.some((userRole) => allowedRoles.includes(userRole));
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
