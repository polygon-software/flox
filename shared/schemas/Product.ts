import * as Joi from 'joi'

// Base Item
export const Product = Joi.object({
    uuid: Joi.string().required().required(),
    title: Joi.string().required().required(),
    description: Joi.string().required(),
    brand: Joi.string().required(),
    category: Joi.string().required(),
    value: Joi.number().required(),
    currency: Joi.number().required(),
    start: Joi.date().required(),
    end: Joi.date().required(),
    picures: Joi.array().items(Joi.string()) ,//TODO How are the images saved?
    status: Joi.string().required(), //TODO Match with ENUMs
    sponsored: Joi.boolean().required(),
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
    minBet: Joi.number().required(),
    maxBet: Joi.number().required(),
    tags: Joi.array().items(Joi.string()).optional(),
    comments: Joi.array().optional(), //TODO Add verifier .items(isSchema(Comment))
    likes: Joi.number().optional()
});
