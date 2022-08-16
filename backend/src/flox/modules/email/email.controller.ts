import { Controller, Post, Query, Req, Res } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { Credentials } from './helpers/email-helpers';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller()
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  // SES credentials
  private readonly credentials: Credentials = {
    region: this.configService.get('AWS_REGION'),
    accessKeyId: this.configService.get('AWS_SES_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_SES_SECRET_ACCESS_KEY'),
  };

  /**
   * Sends a test e-mail to the given address (in 'recipient' param of query)
   * NOTE: This is just an example endpoint. Since it is not marked @Public / @LoggedIn, it will not be accessible by default.
   * @param {FastifyRequest} req - the request
   * @param {FastifyReply} res - reply to send on
   * @param {Record<string, unknown>} query - request query
   * @returns {Promise<void>} - done
   */
  @Post('/sendTestEmail')
  async sendTestEmail(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply<any>,
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
      await this.emailService.sendTestEmail(recipient, this.credentials);
      res.code(200);
      res.send();
    } catch (e) {
      res.code(500);
      res.send(`Error occurred while sending e-mail: ${e.message}`);
    }
  }
}
