import * as Joi from "joi";
import {Item} from "./Item";

// Pure Typescript:
// export interface TimeableItem extends Item{
//     from?: Date,
//     to?: Date,
// }

// An item that can be timed
// Must have either 'from' or 'to' date
export const TimeableItem = Joi.object({
    ...Item,
    from: Joi.date(),
    to: Joi.date(),
}).or('from', 'to');
