import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Sends an e-mail
   * @returns {Promise<void>} - done
   */
  async sendEmail(dataBuffer: Buffer, filename: string): Promise<void> {
    // TODO
    console.log('Blubb send');
  }
}
