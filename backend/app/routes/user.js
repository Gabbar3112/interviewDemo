const userController = require("../controllers/userController");
const appConfig = require("./../../config/appConfig");

const middleware = require('../middlewares/auth');

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    // API are used in current system

    app.post(baseUrl + '/signUp', [userController.createCutomer]);

    app.post(baseUrl + '/login', [userController.loginCustomer]);

    app.post(baseUrl + '/updateCart', middleware.isAuthorize, [userController.addToCart]);

    // End here

};
