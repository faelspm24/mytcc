const express = require("express");
const route = express.Router();
const homeController = require("../controllers/homeController");
const registerController = require("../controllers/registerController");
const mongoose = require("mongoose");
const { loginRequired } = require("../controllers/loginController");
const loginController = require("../controllers/loginController");
const nocache = require("nocache");

// Mongoose connection
mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://faelspm20:naoseiasenha@cluster0.v1s47k7.mongodb.net/tccprojetc?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Database connected with sucess!");
  })
  .catch((error) => {
    console.log(error);
  });

// Rotas da home

route.get("/", homeController.index, (req, res) => {});

// Rotas de registro

route.get("/register", registerController.index, (req, res) => {});
route.post(
  "/register/login",
  registerController.register,
  async (req, res) => {}
);

// Rotas de Login
route.get("/login/index", loginController.index);
route.post("/login/login", loginController.login, (req, res) => {});
route.get("/login/logout", nocache(), loginController.logout, (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Expires", "0");
});

module.exports = route;
