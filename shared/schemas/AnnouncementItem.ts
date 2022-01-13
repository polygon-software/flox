import * as Joi from 'joi'

// Announcement Item
export const AnnouncementItem = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  date: Joi.date().optional(),
  userRole: Joi.string().required(),
  uuid: Joi.string().optional(),
});
