const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListRecord = {
    productName: {
        type: String,
        required: true,
    },
    brandName: {
        type: String,
        required: true,
    },
    storeName: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
}

const ProductListSchema = new Schema({
    list: [ListRecord], // not a schema, so no Object Id
    date: {
        type: Date,
        default: Date.now()
    },
    total: {
        type: Number,
        required: true,
    },
    UserKey: {
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true,
    }
})

module.exports = mongoose.model("ProductList", ProductListSchema);

/* 
>> Current List:
Yo anoto los productos que quiero comprar, cierro mi compu,
voy al super, abro mi app en el celular y veo lo que tenía pensado comprar.

QUITAR
- fecha,
- total,

* dentro de usuario? 
* 

*/