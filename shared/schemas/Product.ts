import * as Joi from 'joi'

// Product Item
export const Product = Joi.object({
    uuid: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().optional(),
    brand: Joi.string().optional(),
    category: Joi.string().optional(),
    value: Joi.number().optional(),
    currency: Joi.number().optional(),
    start: Joi.date().optional(),
    end: Joi.date().optional(),
    pictures: Joi.array().optional(),
    status: Joi.string().required(), //TODO Match with ENUMs
    sponsored: Joi.boolean().optional(),
    directBuyLink: Joi.string().uri().optional(),
    directBuyLinkClicks: Joi.number().optional(),
    directBuyLinkMaxClicks: Joi.number().optional(),
    directBuyLinkCost: Joi.number().optional(),
    directBuyLinkMaxCost: Joi.number().optional(),
    brandLink: Joi.string().uri().optional(),
    brandLinkClicks: Joi.number().optional(),
    brandLinkMaxClicks: Joi.number().optional(),
    brandLinkCost: Joi.number().optional(),
    brandLinkMaxCost: Joi.number().optional(),
    minBet: Joi.number().optional(),
    maxBet: Joi.number().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    comments: Joi.array().optional(), //TODO Add verifier .items(isSchema(Comment))
    likes: Joi.number().optional()
});
