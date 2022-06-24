import { Injectable } from '@nestjs/common';
import { sendEmail } from './helpers/email-helpers';
import { moduleConfig } from './config';

@Injectable()
export class EmailService {
  /**
   * Sends an e-mail
   * @param {string} recipient - e-mail recipient
   * @returns {Promise<void>} - done
   */
  async sendTestEmail(recipient: string): Promise<void> {
    // Get sender from module configuration
    const sender = moduleConfig().emailSender;

    // Send actual e-mail
    await sendEmail(
      sender,
      recipient,
      'Test Message from Flox',
      'This is a test.',
    );
  }
}
