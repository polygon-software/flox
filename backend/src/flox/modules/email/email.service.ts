import { Injectable } from '@nestjs/common';
import { Credentials, sendEmail } from './helpers/email-helpers';
import { moduleConfig } from './config';

@Injectable()
export class EmailService {
  /**
   * Sends an e-mail
   * @param {string} recipient - e-mail recipient
   * @param {Credentials} credentials - SES auth credentials
   * @returns {Promise<void>} - done
   */
  async sendTestEmail(
    recipient: string,
    credentials: Credentials,
  ): Promise<void> {
    // Get sender from module configuration
    const sender = moduleConfig().emailSender;

    // Send actual e-mail
    await sendEmail(
      credentials,
      sender,
      recipient,
      'Test Message from Flox',
      'This is a test.',
    );
  }
}
