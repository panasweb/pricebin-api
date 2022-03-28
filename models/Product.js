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
    store: {
        type: Schema.Types.ObjectId, 
        ref: "Store", 
        required: true,
    },
    currency: {
        type: String,
        maxlength: 3,
        trim: true,
    },

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
    },
    img: {
        type: String
    },
    prices: {
        type: [PriceSchema]
    }
})


module.exports = mongoose.model("Product", ProductSchema);
