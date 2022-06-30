import { Controller, Get, Req, Res } from '@nestjs/common';
import fastify = require('fastify');
import { Public } from '../auth/authentication.decorator';
import { HealthcheckService } from './healthcheck.service';

@Controller()
export class HealthcheckController {
  constructor(private readonly healthcheckService: HealthcheckService) {}

  @Public()
  @Get('/healthcheck')
  async uploadPublicFile(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<any> {
    const healthcheckResult = await this.healthcheckService.healthcheck();

    if (healthcheckResult) {
      res.code(200);
      res.send();
    }

    res.code(500);
    res.send('Something is down lol');
  }
}
