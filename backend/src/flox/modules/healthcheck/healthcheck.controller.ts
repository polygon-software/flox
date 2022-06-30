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
    try {
      await this.healthcheckService.healthcheck();
      res.code(200);
      res.send();
    } catch (e) {
      res.code(500);
      res.send(`Health check failed. Error message: ${e.message}`);
    }
  }
}
