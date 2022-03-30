const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: [Number],
        default: undefined,
        validate: [locationLength, '{PATH} should have exactly 2 values']
    },
    branch: {
        type: String,
        required: false
    },
    logo: {
        type: String,
        required: false
    }
    // rating: {
    //     type: Number,
    //     required: false,
    // }
})

function locationLength(val) {
    return val.length === 2;
}

module.exports = mongoose.model("Store", StoreSchema);
