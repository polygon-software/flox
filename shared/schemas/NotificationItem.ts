import * as Joi from 'joi'

// Base Item
export const NotificationItem = Joi.object({
  uuid: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  received: Joi.date().required(),
  isRead: Joi.boolean().required(),
  user: Joi.any().optional(),
});
