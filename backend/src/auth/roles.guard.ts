import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './authentication.decorator';
import { ANY_ROLE_KEY } from './authorization.decorator';
import { getRequest } from '../helpers';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../modules/user/entities/user.entity';
import { Repository } from 'typeorm';

/**
 * Guard used for defining which roles can access a specific method
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User) private userRepository: Repository<User>,
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
   * todo
   * @param {ExecutionContext} context - context
   * @returns {boolean | Promise<boolean> | Observable<boolean>} - can activate
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // If no roles are specified, allow access only on public resources OR any role
    if (!roles || roles.length === 0) {
      // Determine if resource is public
      const isPublic: boolean =
        this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
          context.getHandler(),
          context.getClass(),
        ]) ?? false;

      // Determine if resource is accessible to any logged-in user
      const anyRole: boolean =
        this.reflector.getAllAndOverride<boolean>(ANY_ROLE_KEY, [
          context.getHandler(),
          context.getClass(),
        ]) ?? false;

      // For publicly accessible resources, allow access by default
      return isPublic || anyRole;
    }
    const req = this.getRequest(context);
    const user = req.user;
    const db_user = await this.userRepository.findOne(user.userId);
    if (!db_user) {
      return false;
    }
    const res = roles.includes(db_user.role) || db_user.role === 'SOI_ADMIN';
    console.log(`${db_user.role} Authenticated: ${res}`);
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
