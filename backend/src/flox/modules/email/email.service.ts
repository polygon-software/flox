import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { render } from 'squirrelly';

import resetTemplate from '../../../templates/email/PasswordResetEmail';
import inviteTemplate from '../../../templates/email/Invitation';

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
   * Send a custom e-mail invitation to a newly created user.
   *
   * @param recipient - e-mail of the new user
   * @param lang - user's language
   * @param [tempPassword] - user's temporary password
   */
  async sendCustomInviteEmail(
    recipient: string,
    lang: string,
    tempPassword?: string,
  ): Promise<void> {
    // TODO: Implemenet application specific

    // Get sender from module configuration
    const sender = moduleConfig().emailAddress;

    // Send actual e-mail
    await sendEmail(
      this.credentials,
      sender,
      recipient,
      this.i18nService.t('authentication.invitation', {
        lang,
      }),
      // E-mail contents from HTML template
      render(inviteTemplate, {
        lang,
        password: tempPassword,
      }) as string,
    );
  }

  /**
   * Sends an e-mail notifying the user that their password was reset, containing their new temporary password
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
      this.i18nService.t('authentication.password_reset', {
        lang,
      }),
      // E-mail contents from HTML template
      render(resetTemplate, {
        lang,
        password: tempPassword,
      }) as string,
    );
  }
}
