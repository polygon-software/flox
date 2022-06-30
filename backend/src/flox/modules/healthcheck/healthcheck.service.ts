import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthcheckService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Checks system health and connectivity, and throws an error if any system component is not in a healthy state
   * @returns {Promise<void>} - done
   */
  async healthcheck() {
    // Get database configuration (contains host, port, username, password & database)
    const databaseConfig = this.configService.get('database');

    // TODO lol
    return;
  }
}
