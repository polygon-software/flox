import * as Joi from 'joi'

// Base Item
export const NotificationItem = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  received: Joi.date().required(),
  isRead: Joi.boolean().required(),
  uuid: Joi.string().optional(),
  user: Joi.any().optional(),
});
