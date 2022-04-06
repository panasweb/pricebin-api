const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
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
    },
    UserLog: {
        monthlyAverage: {
            type: Number,
            default: 0,
        },
        weeklyAverage: {
            type: Number,
            default: 0,
        },
        listAverage: {
            type: Number,
            default: 0,
        },
        nMonths: {
            type: Number,
            default: 1,
        },
        nWeeks: {
            type: Number,
            default: 1,
        },
        start: {
            type: Date,
            default: Date.now()
        },
        globalTotal: {
            type: Number,
            default: 0
        }
    }
})

function validEmail(email) {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
}

module.exports = mongoose.model("User", UserSchema);