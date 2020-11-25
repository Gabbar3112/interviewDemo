var mongoose = require('mongoose');

const schemaOptions = {
    timestamps: {createdAt: 'created_at', updatedAt: 'last_updated'},
};

var productSchema = mongoose.Schema({

    product_id: {type: String, required: true},
    name: {type: String, required: true}

}, schemaOptions);

var products = mongoose.model('products', productSchema);
module.exports = products;
