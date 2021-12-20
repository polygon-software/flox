import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './authentication.decorator';
import { ANY_ROLE_KEY } from './authorization.decorator';
import { getRequest } from '../helpers';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ROLE } from '../ENUM/ENUMS';

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
   * @returns {boolean | Promise<boolean> | Observable<boolean>} - can activate
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Determine if resource is public
    const isPublic: boolean =
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? false;

    if (isPublic) return true;

    // Dev mode: overrides user management:
    const accessOverride = process.env.DEV === 'true';
    const requestedFunction = context.getHandler().name;

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const req = this.getRequest(context);
    const user = req.user;
    const dbUser = await this.userRepository.findOne(user.userId);

    // Admin has access to everything
    if (dbUser.role === ROLE.SOI_ADMIN) {
      return true;
    }

    // If no roles are specified, allow access only on public resources OR any role
    if (!roles || roles.length === 0) {
      // Determine if resource is accessible to any logged-in user
      const anyRole: boolean =
        this.reflector.getAllAndOverride<boolean>(ANY_ROLE_KEY, [
          context.getHandler(),
          context.getClass(),
        ]) && !!dbUser;

      // For publicly accessible resources, allow access by default
      if (accessOverride && !isPublic && !anyRole) {
        console.warn(
          `Debug override used to access private resource: "${requestedFunction}"!`,
        );
        return true;
      }
      return anyRole;
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
    const res = roles.includes(dbUser.role);
    if (accessOverride && !res) {
      console.warn(
        `Debug override used to access resource : "${requestedFunction}" restricted to ${roles.join(
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
}
