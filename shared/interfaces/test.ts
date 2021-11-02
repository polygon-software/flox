import {Item} from "./Item";
import {BuyableItem} from "./BuyableItem";
import {AuctionableItem} from "./AuctionableItem";

// Expected: ok
console.log(
    Item.validate({
    id: "bli-bla-blubb123",
    name: "Käsestück"
    })
)

// Expected: ok
console.log(
    BuyableItem.validate({
        id: "bli-bla-blubb123",
        name: "Käseklotz",
        price: 123
    })
)

// Expected: error
console.log(
    BuyableItem.validate({
        id: "bli-bla-blubb123",
        name: 42,
        price: 'hoi'
    })
)

// Expected: ok
console.log(
    AuctionableItem.validate({
        id: "bli-bla-blubb123",
        name: "Massiver Käse",
        price: 128,
        from: new Date()
    })
)
