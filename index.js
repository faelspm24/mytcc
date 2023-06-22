require("dotenv").config({ path: "variaveis.env" });
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const flash = require("connect-flash");
const routes = require("../tccproject/src/config/routes");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// Mongoose connection

const app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// view engine setup
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.urlencoded());
app.use(express.json());

// Session configuration
app.use(cookieParser("tccprojeto"));
app.use(
  session({
    secret: "sua-chave-secreta-aqui",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

// Flash messages
// Middleware para disponibilizar as mensagens flash para todas as rotas
app.use((req, res, next) => {
  res.locals.successMessages = req.flash("success");
  res.locals.errorMessages = req.flash("errors");
  res.locals.user = req.session.user;
  res.locals.isAdmin = req.session.isAdmin;
  next();
});

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.use(routes);

// Rotas

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${process.env.PORT}`);
});
