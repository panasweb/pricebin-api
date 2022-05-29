const crypto = require('crypto');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ListRecord = require('./ListRecord')
const Token = require('./Token')
const sgMail = require('@sendgrid/mail');
const { get2FAMail } = require("../controllers/mailer");


const CurrentList = {

    list: {
        type: [ListRecord],
        default: []
    },
    total: {
        type: Number,
        default: 0
    },

}

const UserSchema = new Schema({
    verified: {
        type: Boolean,
        default: undefined,
    },
    username: {
        type: String,
        minlength: 1,
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
            type: Number,
            default: 0,
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
        },  // esto se puede calcular anytime, en el back
    },
})

function validEmail(email) {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
}

UserSchema.methods.sendVerificationLink = function (callback) {
    sgMail.setApiKey(process.env.SG_API_KEY);

    console.log("Create token for id:", this.id);
    const token = new Token({ _userId: this.id, token: crypto.randomBytes(16).toString('hex') })
    console.log("New token", token);
    let user = this._doc;
    console.log("User", user);
    try {
        token.save(function (err) {
            if (err) { return console.log(err.message) }
            const message = get2FAMail(user.email, user.displayName, token.token);
            console.log("mail:", message);
            
            sgMail.send(message, function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    console.log("Sendgrid mail success");
                    callback();
                }
            })
        })
    }
    catch (e) {
        console.log("Error on token creation", e);
        callback(e);
    }

}

module.exports = mongoose.model("User", UserSchema);