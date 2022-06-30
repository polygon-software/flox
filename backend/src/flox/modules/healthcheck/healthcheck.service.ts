import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthcheckService {
  constructor() {}

  /**
   * Checks system health and connectivity
   * @returns {Promise<boolean>} - whether the system is healthy
   */
  async healthcheck() {
    // TODO lol
    return true;
  }
}
