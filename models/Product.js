const TYPES = require('../constants').TYPES
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const PriceSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date, default: Date.now()
    },
    currency: {
        type: String,
        maxlength: 3,  // ISO 4217
        trim: true,
    },
    store: {
        type:String,
        required:true,
    },
    StoreKey: {
        type: Schema.Types.ObjectId, 
        ref: "Store", 
        required: true,
    }

})


const ProductSchema = new Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength:140,
    },
    brand: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: true,
        default: null,
        enum: TYPES,
    },
    prices: {
        type: [PriceSchema]
    },
    img: {
        type: String
    }
})


module.exports = mongoose.model("Product", ProductSchema);

/*

{
    "name":,
    "brand":,
    "type":,
    "prices": [
        {
            "amount":,
            "date":,
            "currency":,
            "type":,
            "store":"Walmart",
            "StoreKey":"6244c57c634acd7618dd45f7"
        },
        {
            "amount":,
            "date":,
            "currency":,
            "type":,
            "store":"Superama",
            "StoreKey":""
        }
    ],
    "img":
}

*/