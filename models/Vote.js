const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
    UserKey: {
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true,
    },
    PriceKey: {
        type: Schema.Types.ObjectId, 
        ref: "Price", 
        required: true, 
    }
})


module.exports = mongoose.model("Vote", VoteSchema);
