/* UNUSED */

import {TYPES} from '../constants'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductTypeSchema = new Schema({
    key: {
        type: Number,  // integer
        unique: true,
        required: true,
    },  // Pointed to by Prices
    name: {
        type: String,
        enum: TYPES,
        default: null,
    }
})

module.exports = mongoose.model("ProductType", ProductTypeSchema);
// Ventaja: podemos limitar a un conjunto definido de opciones (departamentos de producto)
// Desventaja: limitamos a los usuarios jeje