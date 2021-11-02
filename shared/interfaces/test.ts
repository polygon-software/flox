import {Item} from "./Item";
import {BuyableItem} from "./BuyableItem";
import {AuctionableItem} from "./AuctionableItem";
import {TimeableItem} from "./TimeableItem";

// Expected: ok
console.log(
    Item.validate({
    id: "bli-bla-blubb123",
    name: "Käsestück"
    })
)

console.log("--------------------")

// Expected: ok
console.log(
    BuyableItem.validate({
        id: "bli-bla-blubb123",
        name: "Käseklotz",
        price: 123
    })
)

console.log("--------------------")

// Expected: error
console.log(
    TimeableItem.validate({
        name: "keine Id",
        from: new Date()
    })
)

console.log("--------------------")

// Expected: error
console.log(
    BuyableItem.validate({
        id: "bli-bla-blubb123",
        name: 42,
        price: 'hoi'
    })
)

console.log("--------------------")

// Expected: ok
console.log(
    AuctionableItem.validate({
        id: "bli-bla-blubb123",
        name: "Massiver Käse",
        price: 128,
        from: new Date()
    })
)

console.log("--------------------")

// Expected: error (no from or to given)
console.log(
    AuctionableItem.validate({
        id: "bli-bla-blubb123",
        name: "Massiver Käse",
        price: 128,
    })
)
