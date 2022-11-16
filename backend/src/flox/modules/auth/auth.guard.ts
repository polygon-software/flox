import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { getRequest } from '../../core/flox-helpers';

/**
 * JSON Web token authentication guard
 */
@Injectable()
export default class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Constructor
   *
   * @param reflector - reflector
   */
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Gets the request from context
   *
   * @param context - execution context of the request
   * @returns the request
   */
  getRequest(context: ExecutionContext): ReturnType<typeof getRequest> {
    return getRequest(context);
  }
}
