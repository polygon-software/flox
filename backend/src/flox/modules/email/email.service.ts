import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';

import { Credentials, sendEmail } from './helpers/email-helpers';
import { moduleConfig } from './config';

@Injectable()
export default class EmailService {
  constructor(
    private readonly i18nService: I18nService,
    private readonly configService: ConfigService,
  ) {}

  // SES credentials
  private readonly credentials: Credentials = {
    region: this.configService.getOrThrow<string>('AWS_MAIN_REGION'),
    accessKeyId: this.configService.getOrThrow<string>(
      'AWS_ADMIN_ACCESS_KEY_ID',
    ),
    secretAccessKey: this.configService.getOrThrow<string>(
      'AWS_ADMIN_SECRET_ACCESS_KEY',
    ),
  };

  /**
   * Sends a test e-mail
   *
   * @param recipient - e-mail recipient
   */
  async sendTestEmail(recipient: string): Promise<void> {
    // Get sender from module configuration
    const sender = moduleConfig().emailAddress;

    // Send actual e-mail
    await sendEmail(
      this.credentials,
      sender,
      recipient,
      'Test Message from Flox',
      'This is a test.',
    );
  }

  /**
   * Sends an e-mail notifying the user that their password was force-changed
   *
   * @param recipient - e-mail recipient
   * @param lang - language
   * @param tempPassword - temporary password
   */
  async sendPasswordResetEmail(
    recipient: string,
    lang: string,
    tempPassword: string,
  ): Promise<void> {
    // Get sender from module configuration
    const sender = moduleConfig().emailAddress;

    // Send actual e-mail
    await sendEmail(
      this.credentials,
      sender,
      recipient,
      this.i18nService.t('authentication.password_changed.title', {
        lang,
      }),
      this.i18nService.t('authentication.password_changed.content', {
        lang,
        args: {
          password: tempPassword,
        },
      }),
    );
  }
}
