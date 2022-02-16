import Joi, { Schema } from 'joi';
import { ROLE } from '../../../definitions/ENUM';
import { AnnouncementItem } from '../../../schemas/AnnouncementItem';

/**
 * A class representing an announcement
 */
export class Announcement {
  title: string;
  date: Date;
  content: string;
  userRoles: ROLE[];
  scheduled: boolean;
  uuid: string | null;

  /**
   * Constructor
   * @param {string} title - title
   * @param {Date} date - received
   * @param {string} content - content
   * @param {string[]} userRoles - user roles
   * @param {boolean} scheduled - scheduled
   * @param {string} uuid - uuid
   */
  constructor(
    title: string,
    date: Date,
    content: string,
    userRoles: ROLE[],
    scheduled: boolean,
    uuid?: string
  ) {
    this.title = title;
    this.date = date;
    this.content = content;
    this.userRoles = userRoles;
    this.scheduled = scheduled;
    this.uuid = uuid ?? null;
  }

  /**
   * Validates the announcement to Joi schema
   * @returns {boolean} whether the announcement fits the schema
   */
  validate(): boolean {
    try {
      Joi.assert(this, AnnouncementItem as unknown as Schema);
      return true;
    } catch (e) {
      return false;
    }
  }
}
