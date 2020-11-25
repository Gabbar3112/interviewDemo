const shortid = require("shortid");
const mongoose = require("mongoose");
const response = require("../libs/responseLib");
const logger = require("../libs/loggerLib");
const check = require("../libs/checkLib");
const tokenLib = require("../libs/tokenLib");
const jwt = require("jsonwebtoken");
const Promise = require("bluebird");
const moment = require("moment");

const jwtSign = Promise.promisify(jwt.sign);
const jwtVerify = Promise.promisify(jwt.verify);
const JWT_SECRET_KEY = "aieufasdjcajsdhcwefwtrdyhjcgfh";

const User = mongoose.model("User");
const customerCart = mongoose.model("customerCart");
const tokenCol = mongoose.model('tokenCollection');

let createCutomer = (req, res) => {
  let validatingInputs = () => {
    console.log("validatingInputs");
    return new Promise((resolve, reject) => {
      if (req.body.email && req.body.password) {
        resolve();
      } else {
        let apiResponse = response.generate(
          true,
          "Required Parameter email or password is missing",
          400,
          null
        );
        reject(apiResponse);
      }
    });
  }; // end of validatingInputs

  let checkUser = () => {
    console.log("checkUser");
    return new Promise((resolve, reject) => {
      User.find(
        {
          email: req.body.email,
        },
        function (err, userDetail) {
          if (err) {
            logger.error(
              "Internal Server error while fetching user",
              "createCutomer => checkUser()",
              5
            );
            let apiResponse = response.generate(true, err, 500, null);
            reject(apiResponse);
          } else if (check.isEmpty(userDetail)) {
            resolve();
          } else {
            logger.error(
              "User Already Exists with this email or username, please change and try again",
              "createCutomer => checkUser()",
              5
            );
            let apiResponse = response.generate(
              true,
              "User Already Exists with this email or username, please change and try again",
              400,
              null
            );
            reject(apiResponse);
          }
        }
      );
    });
  }; // end of checkUser

  let addUser = (final) => {
    console.log("addUser");
    return new Promise((resolve, reject) => {

      let body = {
        user_id: shortid.generate(),
        email: req.body.email,
        password: req.body.password,
      };
      User.create(body, function (err, user) {
        if (err) {
          console.log("err", err);
          logger.error(
            "Internal Server error while create User",
            "createCutomer => addUser()",
            5
          );
          if (err.code === 11000) {
            err = "Duplicate Email. Use Different Email";
          }
          let apiResponse = response.generate(true, err, 500, null);
          reject(apiResponse);
        } else {
          resolve(user);
        }
      });
    });
  }; // end of addUser

  let addCart = (user) => {
    console.log("addCart");
    return new Promise((resolve, reject) => {
      let body = {
        cartId: shortid.generate(),
        cartItems: [],
        user_id: user.user_id,
      };
      customerCart.create(body, function (err, customerCartDetail) {
        if (err) {
          console.log("err", err);
          logger.error(
            "Internal Server error while create Cart",
            "createCutomer => addUser()",
            5
          );
          if (err.code === 11000) {
            err = "Duplicate Email. Use Different Email";
          }
          let apiResponse = response.generate(true, err, 500, null);
          reject(apiResponse);
        } else {
          resolve(user);
        }
      });
    });
  }; // end of addCart

  validatingInputs()
    .then(checkUser)
    .then(addUser)
    .then(addCart)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "Customer Created Successfully!!",
        200,
        resolve
      );
      res.status(200).send(apiResponse);
    })
    .catch((err) => {
      console.log(err);
      res.status(err.status).send(err);
    });
};

let loginCustomer = (req, res) => {
  let validatingInputs = () => {
    console.log("validatingInputs");
    return new Promise((resolve, reject) => {
      if (req.body.email && req.body.password) {
        resolve();
      } else {
        let apiResponse = response.generate(
          true,
          "Required Parameter email or password is missing",
          400,
          null
        );
        reject(apiResponse);
      }
    });
  }; // end of validatingInputs

  let checkUser = () => {
    console.log("checkUser");
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          email: req.body.email,
        },
        function (err, userDetail) {
          if (err) {
            logger.error(
              "Internal Server error while fetching user",
              "loginCustomer => checkUser()",
              5
            );
            let apiResponse = response.generate(true, err, 500, null);
            reject(apiResponse);
          } else if (check.isEmpty(userDetail)) {
            logger.error(
              "User does not Exists",
              "loginCustomer => checkUser()",
              5
            );
            let apiResponse = response.generate(
              true,
              "User does not Exists",
              400,
              null
            );
            reject(apiResponse);
          } else {
            Promise.all([pwdMatch(userDetail)])
              .then((data) => {
                resolve({ user: userDetail, tokens: data[0] });
              })
              .catch((e) => {
                reject(e);
              });
          }
        }
      );
    });
  }; // end of checkUser

  let pwdMatch = (userDetails) => {
    console.log("pwdMatch");
    return new Promise((resolve, reject) => {
      let password = req.body.password;
      userDetails.comparePassword(password, function (err, match) {
        if (err) {
          logger.error(
            "Internal Server Error while compare password",
            "loginCustomer => pwdMatch()",
            5
          );
          let apiResponse = response.generate(
            true,
            "Internal Server Error while compare password",
            500,
            null
          );
          reject(apiResponse);
        } else {
          if (match === true) {
            generateToken(userDetails)
              .then((finaltokens) => {
                resolve(finaltokens);
              })
              .catch((e) => {
                reject(e);
              });
          } else {
            logger.error("Wrong Password", "loginCustomer => pwdMatch()", 5);
            let apiResponse = response.generate(
              true,
              "Wrong Password",
              400,
              null
            );
            reject(apiResponse);
          }
        }
      });
    });
  }; // end of pwdMatch function

  let generateToken = (user) => {
    console.log("generateToken");
    return new Promise((resolve, reject) => {
      tokenLib.generateToken(user, (err, tokenDetails) => {
        if (err) {
          logger.error(
            "Failed to generate token",
            "userController => generateToken()",
            10
          );
          let apiResponse = response.generate(
            true,
            "Failed to generate token",
            500,
            null
          );
          reject(apiResponse);
        } else {
          let finalObject = user.toObject();
          delete finalObject.__v;
          tokenDetails.userId = user._id;
          tokenDetails.userDetails = finalObject;
          saveToken(tokenDetails)
            .then((saveTokenResult) => {
              resolve(saveTokenResult);
            })
            .catch((e) => {
              reject(e);
            });
        }
      });
    });
  }; // end of generateToken

  let saveToken = (tokenDetails) => {
    console.log("saveToken");
    return new Promise((resolve, reject) => {
      let timestamp = new Date();
      let timestamp1 = new Date(timestamp);
      let newAuthToken = new tokenCol({
        userId: tokenDetails.userId,
        expireAt: timestamp1.setMinutes(timestamp.getMinutes() + 1440), // set expiry after 24 hours. 1440 == 24 hour
        authToken: tokenDetails.token,
        // we are storing this is due to we might change this from 15 days
        tokenSecret: tokenDetails.tokenSecret,
        tokenGenerationTime: new Date().getTime(),
      });

      newAuthToken.save((err, newTokenDetails) => {
        if (err) {
          console.log(err);
          let apiResponse = response.generate(
            true,
            "Failed to save token",
            500,
            null
          );
          reject(apiResponse);
        } else {
          let responseBody = {
            authToken: newTokenDetails.authToken,
          };
          resolve(responseBody);
        }
      });
    });
  }; // end of saveToken

  validatingInputs()
    .then(checkUser)
    .then((resolve) => {
      let apiResponse = response.generate(
        false,
        "Login Successfully!!",
        200,
        resolve
      );
      res.status(200).send(apiResponse);
    })
    .catch((err) => {
      console.log(err);
      res.status(err.status).send(err);
    });
};

let addToCart = (req, res) => {

  let validatingInputs = () => {
      console.log("validatingInputs");
      return new Promise((resolve, reject) => {
          if (req.body.cartItems && req.body.user_id) {
              resolve();
          } else {
              let apiResponse = response.generate(true, "Required Parameter cartItems or user_id is missing", 400, null);
              reject(apiResponse);
          }
      });
  }; // end of validatingInputs

  let checkUser = () => {
      console.log("checkUser");
      return new Promise((resolve, reject) => {
          User.find({user_id: req.body.user_id}, function (err, userDetail) {
              if (err) {
                  logger.error("Internal Server error while fetching user", "addToCard => checkUser()", 5);
                  let apiResponse = response.generate(true, err, 500, null);
                  reject(apiResponse);
              } else if (check.isEmpty(userDetail)) {
                  logger.error("Customer Not Found", "addToCard => checkUser()", 5);
                  let apiResponse = response.generate(true, "Customer Not Found", 400, null);
                  reject(apiResponse);
              } else {
                  resolve(userDetail)
              }
          })
      });
  }; // end of checkUser

  let updateCart = () => {
      console.log("updateCart");
      return new Promise((resolve, reject) => {
          customerCart.find({user_id: req.body.user_id}, function (err, cartDetails) {
              if (err) {
                  logger.error("Internal Server error while fetching user", "addToCard => updateCart()", 5);
                  let apiResponse = response.generate(true, err, 500, null);
                  reject(apiResponse);
              } else if (check.isEmpty(cartDetails)) {
                  let body = {
                      cartId: shortid.generate(),
                      cartItems: req.body.cartItems,
                      user_id: req.body.user_id,
                  };
                  customerCart.create(body, function (err, newCart) {
                      if (err) {
                          logger.error("Internal Server error creating new cart for customer", "addToCard => updateCart()", 5);
                          let apiResponse = response.generate(true, err, 500, null);
                          reject(apiResponse);
                      } else {
                          resolve(newCart);
                      }
                  })
              } else {
                  cartDetails[0].cartItems = req.body.cartItems;
                  cartDetails[0].save();
                  resolve(cartDetails);
              }
          })
      });
  }; // end of fetchAdmin

  validatingInputs()
      .then(checkUser)
      .then(updateCart)
      .then((resolve) => {
          let apiResponse = response.generate(false, "Cart update Successfully!!", 200, resolve);
          res.status(200).send(apiResponse);
      })
      .catch((err) => {
          console.log(err);
          res.status(err.status).send(err);
      });
};

module.exports = {
  createCutomer: createCutomer,
  loginCustomer: loginCustomer,
  addToCart: addToCart
};
