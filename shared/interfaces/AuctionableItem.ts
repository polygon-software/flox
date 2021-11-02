import * as Joi from "joi";
import {TimeableItem} from "./TimeableItem";
import {BuyableItem} from "./BuyableItem";

// An item that can be timed and bought
export const AuctionableItem = Joi.object({
    ...TimeableItem.keys,
    ...BuyableItem.keys
});
