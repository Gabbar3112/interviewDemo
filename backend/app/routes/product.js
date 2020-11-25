const productController = require("./../../app/controllers/productController");
const appConfig = require("./../../config/appConfig");

const middleware = require('../middlewares/auth');

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/products`;

    // defining routes.
    app.post(baseUrl + '/', [productController.createProduct]);

    app.get(baseUrl + '/getAllProducts', middleware.isAuthorize, [productController.getAdminProducts]);

};