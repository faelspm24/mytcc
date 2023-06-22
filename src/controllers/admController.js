const admModel = require("../models/admLoginModel");
const Agendamento = require("../models/agendamentoModel");
const { ObjectId } = require("mongodb");

exports.index = function (req, res) {
  res.render("rootRegister", {
    errors: req.flash("errors"),
    success: req.flash("success"),
  });
};

exports.indexx = function (req, res) {
  res.render("rootLoginn", {
    errors: req.flash("errors"),
    success: req.flash("success"),
  });
};

exports.register = async function (req, res) {
  try {
    const login = new admModel(req.body);
    await login.register();
    // ...

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(function () {
        res.render("rootRegister", {
          errors: req.flash("errors"),
          success: req.flash("success"),
        });
      });
      return;
    }

    // ...
    req.flash("success", "Seu usuário foi criado com sucesso!");
    req.session.save(function () {
      return res.redirect("/");
    });
  } catch (e) {
    console.log(e);
    return res.render("404");
  }
};

exports.login = async function (req, res) {
  try {
    const login = new admModel(req.body);
    await login.login();
    // ...

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(function () {
        res.render("rootLoginn", {
          errors: req.flash("errors"),
          success: req.flash("success"),
        });
      });
      return;
    }
    // ...
    req.session.isAdmin = true;
    req.session.save(function () {
      return res.render("roothome");
    });
  } catch (e) {
    console.log(e);
    return res.render("404");
  }
};

exports.requireAdmin = function (req, res, next) {
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(403).send("Acesso negado");
  }
};

exports.allRegisters = async function (req, res) {
  try {
    const consultas = await Agendamento.find({});
    res.status(200).render("todasAgendas", { consultas });
  } catch (e) {
    res.status(500).json({ message: "Erro ao consultar" });
  }
};

exports.excluirRegistro = async function (req, res) {
  try {
    const agendamentoId = req.params.id;
    const data = await Agendamento.deleteOne({ _id: ObjectId(agendamentoId) });

    if (data.deletedCount > 0) {
      res.status(200).json({ message: "Registro excluído com sucesso" });
    } else {
      res.status(404).json({ message: "Registro não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao excluir o registro:", error);
    res.status(500).json({ message: "Erro ao excluir o registro" });
  }
};
