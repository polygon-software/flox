import * as Joi from 'joi'

// AddressItem Item
export const AddressItem = Joi.object({
  street: Joi.string().required(),
  number: Joi.string().required(),
  city: Joi.string().required(),
  zipCode: Joi.string().required(),
});
