import * as Joi from 'joi'

// AddressItem Item
export const UserItem = Joi.object({
    role: Joi.string().required(),
    fk: Joi.string().required(),
    uuid: Joi.string().required(),
});
