const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ListRecord = require('./ListRecord')

const CurrentList = {

    list: {
        type: [ListRecord],
        default: []
    } , 
    total: {
        type: Number,
        default: 0
    },

}

const UserSchema = new Schema({
    username: {
        type: String,
        minlength:1,
        maxlength: 100,
        trim: true,
        required: false,
    },
    avatar: {
        type: String, // url
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
        default: 0,  // rank 10 is Admin
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
        }, // calculated over existing months
        weeklyAverage: {
            type: Number,
            default: 0,  
        },  // total / nWeeks
        listAverage: {
            type: Number,
            default: 0,
        },
        nMonths: {
            type: Number,
            default: 1,
        },  // total number of months since start
        nWeeks: {
            type: Number,
            default: 1,
        },  // total number of weeks since start
        start: {
            type: Date,
            default: Date.now()
        },
        globalTotal: {
            type: Number,
            default: 0
        }  // esto se puede calcular anytime, en el back
    },
})

function validEmail(email) {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
}

module.exports = mongoose.model("User", UserSchema);