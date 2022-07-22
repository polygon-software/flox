import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';

/**
 * Validation strategy for JSON web tokens from Cognito
 */

export class JwtStrategyValidationPayload {
  sub: string;
  username: string;
}

export class JwtStrategyValidationResult {
  userId: string;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://cognito-idp.${process.env.AWS_MAIN_REGION}.amazonaws.com/${process.env.USER_POOL_ID}/.well-known/jwks.json`,
      }),
    });
  }

  /**
   * Validates the JWT token and appends the user to the Request
   * Note: This is only triggered once the JWT's validity (from-url and expiration) has been checked successfully!
   * @param {JwtStrategyValidationPayload} payload - decoded JSON Web Token (JWT)
   * @returns {JwtStrategyValidationResult} - object with Cognito userId and username
   */
  validate(payload: JwtStrategyValidationPayload): JwtStrategyValidationResult {
    console.log('JWT validation for', payload);
    const username = payload['cognito:username'];
    return {
      userId: payload.sub,
      username: username,
    } as JwtStrategyValidationResult;
  }
}
