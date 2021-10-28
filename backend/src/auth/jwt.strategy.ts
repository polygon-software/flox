import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as jwkToPem from 'jwk-to-pem';

const keyObject = {
  alg: 'RS256',
  e: 'AQAB',
  kid: 'yfQu0/N8wCd0EJKkTauWkU2a+15bYYWrJfPEUBJwCWQ=',
  kty: 'RSA',
  n: 'pc-kq76um33KpXwKSLCJF6qaUFy-s25NssKqDDBrrS0YuPsjOU81jlxZ50aRJuKZVZW5dtPpxsh8EI1YqT7vBuujN0A94LIvMg5GaRpBIy7zzsAHVvcFP6kYQ2cSF6WuCxJtxH7jPi0-fIwbbGR0-5RFLdsDK--XmCftiQfOFeAJ2wX99GkeiceWT7gRZ3yOZd6Gp-9eYVxZdxsK70bI_WnKTFdxydjKmlLZ8jAqEUbB1jXHF5soc7YChrubFWI1qXSjRCzD0SlBFsa6S2bXBkor9T5Vws0X9kf9SO7vT1YHhvo1OneFq74w_vyM3JY7eSUrxXHJ5S7sOO4hPD3rMw',
  use: 'sig',
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwkToPem(keyObject),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
