const express = require("express");
const route = express.Router();
const homeController = require("../controllers/homeController");
const registerController = require("../controllers/registerController");
const mongoose = require("mongoose");
const { loginRequired } = require("../controllers/loginController");
const { requireAdmin } = require("../controllers/loginController");
const loginController = require("../controllers/loginController");
const agendamentoController = require("../controllers/agendaController");
const admController = require("../controllers/admController");

const nocache = require("nocache");

// Mongoose connection
mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://faelspm20:naoseiasenha@cluster0.w3ur3m7.mongodb.net/?retryWrites=true&w=majority"
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

// Rotas de Agendamento

route.get("/agendamento", loginRequired, agendamentoController.index);
route.get("/agendamento/consultar", agendamentoController.consultar);
// ...

// ...

route.post("/agendamento/register", agendamentoController.register);

// ...

// Rotas de login do administrador

route.get("/administrador/index", admController.index);
route.post("/register/adm", admController.register);
route.get("/login/administrador", admController.indexx);

route.post("/login/administrador", admController.login);
route.get(
  "/login/administrador/agendamentos",
  admController.requireAdmin,
  admController.allRegisters
);
route.get("/excluir/:id", admController.excluirRegistro);
route.get("/editar/usuario/:id", admController.editarRegistroIndex);
route.post("/editar/usuario/edicao/:id", admController.editarRegistro);

module.exports = route;
