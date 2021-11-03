import * as Joi from 'joi'

// Base Item
export const Item = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
});
