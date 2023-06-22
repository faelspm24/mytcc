const mongoose = require("mongoose");
const Login = require("../models/loginModel");
const Agendamento = require("../models/agendamentoModel");
const session = require("express-session");

exports.index = function (req, res) {
  res.render("agendamento", { user: req.session.user });
};

exports.register = function (req, res) {
  if (!req.body) {
    res
      .status(400)
      .send({ message: "Não foi possível realizar o cadastro, desculpe!" });
    return;
  }

  // Verificar se a sessão do usuário está definida e contém o ID do usuário
  if (!req.session.user || !req.session.user._id) {
    res.status(400).send({ message: "Sessão inválida!" });
    return;
  }

  // Verificar se o ID do usuário é válido
  const userId = req.session.user._id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).send({ message: "ID do usuário inválido!" });
    return;
  }
  const user = req.session.user;

  const novoAgendamento = new Agendamento({
    usuario: user._id,
    nome: req.body.nome,
    serie: req.body.serie,
    horario: req.body.horario,
    data: req.body.data,
    computadores: req.body.computadores,
    periodo: req.body.periodo,
  });

  novoAgendamento
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Ocorreu algum erro durante a criação do agendamento.",
      });
    });
};
exports.consultar = async function (req, res) {
  try {
    const userId = req.session.user;
    const consultas = await Agendamento.find({ usuario: userId });
    res.status(200).send(consultas);
  } catch (e) {
    res.status(500).json({ message: "Erro ao consultar" });
  }
};
