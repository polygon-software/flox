import * as Joi from 'joi'
import {Item} from "./Item";

// An item that can be bought
export const BuyableItem = Joi.object({
    ...Item,
    price: Joi.number().required()
});
