import * as Joi from 'joi'

// Announcement Item
export const AnnouncementItem = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  date: Joi.date().required(),
  userRole: Joi.string().required(),
  scheduled: Joi.boolean().required(),
  uuid: Joi.string().optional(),
});
