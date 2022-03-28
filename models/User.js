const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    displayName: {
        type: String,
        minlength:1,
        maxlength: 20,
        trim: true,
        required: false,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        validate: [validEmail, "Not a valid email"],
    },
    rank: {
        type: Number,
        default: 0,
    },
    points: {
        type: Number,
        default: 0,
    }
})

function validEmail(email) {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
}

module.exports = mongoose.model("User", UserSchema);