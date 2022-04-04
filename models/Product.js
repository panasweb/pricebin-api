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
        required: true,
    },
    brand: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        default: null,
        enum: TYPES,
    },
    prices: {
        type: [PriceSchema],
        default: undefined,
    },
    img: {
        type: String
    }
})


module.exports = mongoose.model("Product", ProductSchema);
