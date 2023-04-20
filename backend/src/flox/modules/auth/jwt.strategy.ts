import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

import Env from '../../../env';

import { CognitoUserType } from './types/cognito-user.type';

/**
 * Validation strategy for JSON web tokens from Cognito
 */

export type JwtStrategyValidationPayload = {
  'cognito:username': string;
  sub: string;
  username: string;
};

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://cognito-idp.${Env.AWS_MAIN_REGION}.amazonaws.com/${Env.USER_POOL_ID}/.well-known/jwks.json`,
      }),
    });
  }

  /**
   * Validates the JWT token and appends the user to the Request
   * Note: This is only triggered once the JWT's validity (from-url and expiration) has been checked successfully!
   *
   * @param payload - decoded JSON Web Token (JWT)
   * @returns object with Cognito userId and username
   */
  validate(payload: JwtStrategyValidationPayload): CognitoUserType {
    const username = payload['cognito:username'];
    return {
      uuid: payload.sub,
      username,
    } as CognitoUserType;
  }
}
