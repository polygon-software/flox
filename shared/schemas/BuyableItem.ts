import * as Joi from 'joi'
import {Item} from "./Item";

// An item that can be bought
export const BuyableItem = Item.concat(Joi.object({
    price: Joi.number().required()
}));
