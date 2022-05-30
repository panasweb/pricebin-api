const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
    UserKey: {
        type: String, // could later change to ObjectId
        ref: "User", 
        required: true,
    },
    PriceKey: {
        type: Schema.Types.ObjectId, 
        ref: "Price", 
        required: true, 
    }
})

VoteSchema.index({ "UserKey": 1, "PriceKey": 1}, { "unique": true });
module.exports = mongoose.model("Vote", VoteSchema);
