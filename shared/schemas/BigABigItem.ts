import * as Joi from 'joi'

// Base Item
export const BigABigItem = Joi.object({
    id: Joi.string().required().required(),
    name: Joi.string().required().required(),
    description: Joi.string().required(),
    brand: Joi.string().required(),
    category: Joi.string().required(),
    from: Joi.date().required(),
    to: Joi.date().required(),
    minBet: Joi.number().required(),
    maxBet: Joi.number().required(),
    value: Joi.number().required(),
    currency: Joi.number().required(),
    tags: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().required(),
    type: Joi.string().required(),
    productPage: Joi.string().uri().optional(),
    productPageMaxClicks: Joi.number().optional(),
    productPageClicks: Joi.number().optional(),
    productPageMaxCost: Joi.number().optional(),
    productPageCost: Joi.number().optional(),
    sellerPage: Joi.string().uri().optional(),
    sellerPageMaxClicks: Joi.number().optional(),
    sellerPageClicks: Joi.number().optional(),
    sellerPageMaxCost: Joi.number().optional(),
    sellerPageCost: Joi.number().optional(),
    images: Joi.array().items(Joi.string()) //TODO How are the images saved?
});
