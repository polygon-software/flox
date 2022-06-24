import { Controller, Post, Query, Req, Res } from '@nestjs/common';
import fastify = require('fastify');
import { Public } from '../auth/authentication.decorator';
import { EmailService } from './email.service';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Sends a test e-mail to the given address (in 'recipient' param of query)
   * @param {FastifyRequest} req - the request
   * @param {FastifyReply} res - reply to send on
   * @param {Record<string, unknown>} query - request query
   * @returns {Promise<void>} - done
   */
  @Post('/sendTestEmail')
  // @LoggedIn()
  @Public()
  async sendTestEmail(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
    @Query() query: Record<string, unknown>,
  ): Promise<void> {
    // Access to triggering user's Cognito UUID (if needed)
    //const triggeredBy = req['user'].userId;

    const recipient = query.recipient as string;

    if (!recipient) {
      throw new Error('No recipient given!');
    }

    // Send e-mail
    try {
      await this.emailService.sendTestEmail(recipient);
      res.code(200);
      res.send();
    } catch (e) {
      res.code(500);
      res.send(`An error occurred: ${e.message}`);
    }
  }
}
