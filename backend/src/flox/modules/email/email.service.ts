import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sendEmail } from './helpers/email-helpers';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Sends an e-mail
   * @returns {Promise<void>} - done
   */
  async sendEmail(): Promise<void> {
    // TODO
    console.log('Blubb send');
    await sendEmail('yeet@failure.com', 'blubb@blubb.co', 'test', 'oof oof');
  }
}
