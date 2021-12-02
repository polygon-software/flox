import { Controller, Post, Req, Res } from '@nestjs/common';
import fastify = require('fastify');
import { Public } from '../../auth/authentication.decorator';
import { sendPasswordChangeEmail } from './helper';

@Controller()
export class EmailController {
  @Public()
  @Post('/sendPasswordChangeEmail')
  async sendPasswordChangeEmail(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<any> {
    const baseURL = 'TODO';
    const SESClient: SESClient | undefined = undefined;
    await sendPasswordChangeEmail(
      req.body.email,
      req.body.password,
      req.body.type,
      baseURL,
      SESClient,
    );
  }
}
