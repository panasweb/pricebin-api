const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListRecordSchema = {
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
    list: [ListRecordSchema],
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