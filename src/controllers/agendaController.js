const mongoose = require("mongoose");
const Login = require("../models/loginModel");
const Agendamento = require("../models/agendamentoModel");
const Computadores = require("../models/computadoresModel");

exports.index = async function (req, res) {
  try {
    const consultas = await Agendamento.find({});
    const computadores = await Computadores.find();

    res.render("consultaragenda", {
      user: req.session.user,
      consultas: consultas,
      computadores: computadores,
    });
  } catch (error) {
    console.error("Erro ao obter as consultas:", error);
    res.status(500).json({ message: "Erro ao obter as consultas" });
  }
};

exports.register = async function (req, res) {
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

  const computadorId = req.body.computadores;

  // Atualizar o status do computador para false
  await Computadores.findByIdAndUpdate(computadorId, { disponivel: false });

  const novoAgendamento = new Agendamento({
    usuario: user._id,
    nome: req.body.nome,
    serie: req.body.serie,
    horario: req.body.horario,
    data: req.body.data,
    computadores: computadorId,
    periodo: req.body.periodo,
  });

  novoAgendamento.save();
  res.render("home");
};

exports.consultar = async function (req, res) {
  try {
    const userId = req.session.user;

    const consultas = await Agendamento.find({ usuario: userId });
    const computadores = await Computadores.find({});

    res.render("agendamento", { consultas, computadores });
  } catch (e) {
    res.status(500).json({ message: "Erro ao consultar" });
  }
};
