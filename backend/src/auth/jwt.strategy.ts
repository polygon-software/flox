import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';

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
        // TODO set via env variable
        jwksUri:
          'https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_p0iRCiOlU/.well-known/jwks.json',
      }),
    });
  }

  /**
   * Validates the JWT token and appends the user to the Request
   * @param {JwtStrategyValidationPayload} payload - decoded JSON Web Token (JWT)
   */
  validate(payload: JwtStrategyValidationPayload): JwtStrategyValidationResult {
    const username = payload['cognito:username'];
    return { userId: payload.sub, username: username };
  }
}
