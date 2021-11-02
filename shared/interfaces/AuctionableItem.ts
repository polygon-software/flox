import * as Joi from "joi";
import {BuyableItem} from "./BuyableItem";
import {TimeableItem} from "./TimeableItem";


// An item that can be timed and bought
export const AuctionableItem = TimeableItem.concat(BuyableItem);
