import Joi, { Schema } from 'joi';
import { NotificationItem } from '../../../../shared/schemas/NotificationItem';

/**
 * A class representing a notification
 */
export class Notification {
  title: string;
  received: Date;
  content: string;
  isRead: boolean;
  uuid: string | null;
  user: Record<string, unknown> | null;
  announcement: Record<string, unknown> | null;

  /**
   * Constructor
   * @param {string} title - title
   * @param {Date} received - received
   * @param {string} content - content
   * @param {boolean} isRead - is read
   * @param {string} uuid - uuid
   * @param {Record<string, unknown>} user - user
   * @param {Record<string, unknown>} announcement - announcement
   */
  constructor(
    title?: string,
    received?: Date,
    content?: string,
    isRead?: boolean,
    uuid?: string,
    user?: Record<string, unknown>,
    announcement?: Record<string, unknown>
  ) {
    this.title = title ?? '';
    this.received = received ?? new Date();
    this.content = content ?? '';
    this.isRead = isRead ?? false;
    this.uuid = uuid ?? null;
    this.user = user ?? null;
    this.announcement = announcement ?? null;
  }

  /**
   * Validates the notification to Joi schema
   * @returns {boolean} whether the notification fits the schema
   */
  validate(): boolean {
    try {
      Joi.assert(this, NotificationItem as unknown as Schema);
      return true;
    } catch (e) {
      return false;
    }
  }
}
