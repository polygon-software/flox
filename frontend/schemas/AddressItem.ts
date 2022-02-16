import * as Joi from 'joi'

// Address Item
export const AddressItem = Joi.object({
  street: Joi.string().required(),
  number: Joi.string().required(),
  city: Joi.string().required(),
  zipCode: Joi.string().required(),
});
