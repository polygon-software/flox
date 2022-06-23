import { Controller, Post, Req, Res } from '@nestjs/common';
import fastify = require('fastify');
import { LoggedIn, Public } from '../auth/authentication.decorator';
import { EmailService } from './email.service';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/sendTestEmail')
  @LoggedIn()
  async sendTestEmail(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<any> {
    // Get user, as determined by JWT Strategy
    const triggeredBy = req['user'].userId;

    // TODO
    // await this.emailService.sendEmail();
    res.send('OK'); // TODO
  }
}
