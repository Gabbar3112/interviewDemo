const shortid = require('shortid');
const mongoose = require('mongoose');
const response = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib');

const Products = mongoose.model('products');

let createProduct = (req, res) => {

    let validatingInputs = () => {
        console.log("validatingInputs");
        return new Promise((resolve, reject) => {
            if (req.body.name) {
                resolve();
            } else {
                let apiResponse = response.generate(true, "Required Parameter name, is missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validatingInputs

    let checkProduct = () => {
        console.log("checkProduct");
        return new Promise((resolve, reject) => {
            Products.find({name: req.body.name}, function (err, productsDetail) {
                if (err) {
                    logger.error("Internal Server error while fetching product", "createProduct => checkProduct()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(productsDetail)) {
                    resolve();
                } else {
                    logger.error("This product is already register", "createProduct => checkProduct()", 5);
                    let apiResponse = response.generate(true, "This product is already register", 400, null);
                    reject(apiResponse);
                }
            })
        });
    }; // end of checkProduct

    let addProduct = () => {
        console.log("addProduct");
        return new Promise((resolve, reject) => {
            const body = {
                product_id: shortid.generate(),
                name: req.body.name,
            };
            Products.create(body, function (err, product) {
                if (err) {
                    logger.error("Internal Server error while create product", "createProduct => addProduct()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else {
                    resolve(product);
                }
            })
        });
    }; // end of addProduct

    validatingInputs()
        .then(checkProduct)
        .then(addProduct)
        .then((resolve) => {
            let apiResponse = response.generate(false, "Product Created Successfully!!", 200, resolve);
            res.status(200).send(apiResponse);
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
};

let getAdminProducts = (req, res) => {

    let getProductList = () => {
        console.log("addProduct");
        return new Promise((resolve, reject) => {
            Products.find({}, function (err, productsList) {
                if (err) {
                    logger.error("Internal Server error while create User", "getAdminProducts => getProductList()", 5);
                    let apiResponse = response.generate(true, err, 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(productsList)) {
                    logger.error("No Product Found", "createUser => getProductList()", 5);
                    let apiResponse = response.generate(true, "No Product Found", 400, null);
                    reject(apiResponse);
                } else {
                    resolve(productsList);
                }
            })
        });
    }; // end of addUser

    getProductList()
        .then((resolve) => {
            let apiResponse = response.generate(false, "Get Product List Successfully!!", 200, resolve);
            res.status(200).send(apiResponse);
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err);
        });
};

module.exports = {
    createProduct: createProduct,
    getAdminProducts: getAdminProducts
};
