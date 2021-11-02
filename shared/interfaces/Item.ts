import * as Joi from 'joi'

// Pure Typescript:
// export interface Item{
//     readonly id: String,
//     name: String
// }


// Base Item
export const Item = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
});
