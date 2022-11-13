import { Controller, Post, Query, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { Credentials } from './helpers/email-helpers';
import EmailService from './email.service';

@Controller()
export default class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  // SES credentials
  private readonly credentials: Credentials = {
    region: this.configService.getOrThrow('AWS_MAIN_REGION'),
    accessKeyId: this.configService.getOrThrow('AWS_SES_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.getOrThrow('AWS_SES_SECRET_ACCESS_KEY'),
  };

  /**
   * Sends a test e-mail to the given address (in 'recipient' param of query)
   * NOTE: This is just an example endpoint. Since it is not marked @Public / @LoggedIn, it will not be accessible by default.
   *
   * @param req - the request
   * @param res - reply to send on
   * @param query - request query
   * @returns done
   */
  @Post('/sendTestEmail')
  async sendTestEmail(
    @Req() req: Request,
    @Res() res: Response,
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
      res.status(200);
      res.send();
    } catch (e: any) {
      res.status(500);
      res.send(`Error occurred while sending e-mail: ${e.message}`);
    }
  }
}
