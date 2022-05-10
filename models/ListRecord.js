
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

module.exports = ListRecord;