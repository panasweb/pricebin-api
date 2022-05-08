const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListRecord = {
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


const CurrentList = {

    list: {
        type: [ListRecord],
        default: []
    } , 
    total: {
        type: Number,
        required: true,
    },

}

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
    currentList: CurrentList,
    UserLog: {
        nLists: {
            type:Number,
            default:0,
        },
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