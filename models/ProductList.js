const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ListRecord = require('./ListRecord')


const ProductListSchema = new Schema({
    list: {
        type: [ListRecord],
        validate: [productListLength, '{PATH} should have exactly 2 values']
    }, // not a schema, so no Object Id
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

function productListLength(val) {
    return val.length > 0;
}

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