import * as Joi from 'joi'
import {Item} from "./Item";

// Pure Typescript:
// export interface BuyableItem extends Item{
//     price: number
// }

// An item that can be bought
export const BuyableItem = Joi.object({
    ...Item,
    price: Joi.number().required()
});
