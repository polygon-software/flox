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
        jwksUri:
          'https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_DGPNZZeuX/.well-known/jwks.json',
      }),
    });
  }

  validate(payload: JwtStrategyValidationPayload): JwtStrategyValidationResult {
    console.log('Validate JWT payload for UUID', payload.sub);
    return { userId: payload.sub, username: payload.username };
  }
}
