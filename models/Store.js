const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        required: false
    },
    logo: {
        type: String,
        required: false
    },
    lat: {
        type: Number,
        required: false
    },
    lon: {
        type: Number,
        required: false
    },
    // rating: {
    //     type: Number,
    //     required: false,
    // }
})