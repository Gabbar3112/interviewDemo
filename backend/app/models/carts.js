'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const schemaOptions = {
    timestamps: {createdAt: 'created_at', updatedAt: 'last_updated'},
    versionKey: false
};

let customerCartSchema = new Schema({
    cartId: {
        type: String,
        default: '',
    },
    cartItems: {type: Array, required: true, default: []},
    customer_id: String,
}, schemaOptions)


mongoose.model('customerCart', customerCartSchema);
