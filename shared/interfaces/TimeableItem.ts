import * as Joi from "joi";
import {Item} from "./Item";

// An item that can be timed
// Must have either 'from' or 'to' date
export const TimeableItem = Joi.object({
    ...Item.keys(),
    from: Joi.date(),
    to: Joi.date(),
}).or('from', 'to');
