import Joi, {Schema} from 'joi';
import {NotificationItem} from '../../../../shared/schemas/NotificationItem';

/**
 * A class representing an notification
 */
export class Notification{
  title: string
  received: Date
  content: string
  isRead: boolean
  user: Record<string, unknown> | null

  /**
   * Constructor
   * @param {string} title - title
   * @param {Date} received - received
   * @param {string} content - content
   * @param {boolean} isRead - is read
   * @param {Record<string, unknown>} user - user
   */
  constructor(title?: string, received?: Date, content?: string, isRead?: boolean, user?: Record<string, unknown>) {
    this.title = title ?? ''
    this.received = received ?? new Date()
    this.content = content ?? ''
    this.isRead = isRead ?? false
    this.user = user ?? null
  }

  /**
   * Validates the notification to Joi schema
   * @returns {boolean} whether the notification fits the schema
   */
  validate(): boolean{
    try {
      Joi.assert(this, NotificationItem as Schema)
      return true;
    } catch (e) {
      return false
    }
  }
}
