import * as Joi from 'joi'
import {Item} from "./Item";

// An item that contains a link
export const LinkItem = Item.concat(Joi.object({
    link: Joi.string().uri().required()
}));
