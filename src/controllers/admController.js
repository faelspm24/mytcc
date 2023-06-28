const admModel = require("../models/admLoginModel");
const Agendamento = require("../models/agendamentoModel");
const { ObjectId } = require("mongodb");
const Computadores = require("../models/computadoresModel");

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
    const filter = { _id: new ObjectId(agendamentoId) };

    const result = await Agendamento.deleteOne(filter);

    if (result.deletedCount === 1) {
      res.redirect("/login/administrador/agendamentos/");
    } else {
      res.status(404).json({ message: "Registro não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao excluir o registro:", error);
    res.status(500).json({ message: "Erro ao excluir o registro" });
  }
};

exports.editarRegistroIndex = async function (req, res) {
  try {
    const agendamentoId = req.params.id;

    // Consultar o agendamento com base no ID
    const agendamento = await Agendamento.findById(agendamentoId);

    if (!agendamento) {
      // Agendamento não encontrado
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }

    // Renderizar a view "EditarDados" com os dados do agendamento
    res.render("EditarDados", {
      _id: agendamento._id,
      nome: agendamento.nome,
      serie: agendamento.serie,
      horario: agendamento.horario,
      data: agendamento.data,
      computadores: agendamento.computadores,
      periodo: agendamento.periodo,
    });
  } catch (error) {
    console.error("Erro ao obter os dados do agendamento:", error);
    res.status(500).json({ message: "Erro ao obter os dados do agendamento" });
  }
};

exports.editarRegistro = async function (req, res) {
  try {
    const agendamentoId = req.params.id;
    const { nome, serie, horario, data, computadores, periodo } = req.body;

    // Verifique se todos os campos necessários estão presentes no corpo da solicitação
    if (!nome) {
      return res.status(400).render("editarDados", {
        error: "Campo nome é obrigatório",
      });
    }

    const filter = { _id: new ObjectId(agendamentoId) };
    const update = {
      $set: { nome, serie, horario, data, computadores, periodo },
    };

    const result = await Agendamento.updateOne(filter, update);

    if (result.matchedCount === 1) {
      res.redirect("/login/administrador/agendamentos");
    } else {
      res.status(404).json({ message: "Registro não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao editar o registro:", error);
    res.status(500).json({ message: "Erro ao editar o registro" });
  }
};

exports.editarComputadores = async function (req, res) {
  try {
    const computadores = await Computadores.find({});

    res.render("editarComputadores", {
      computadores: computadores,
    });
  } catch (error) {
    console.error("Erro ao obter os computadores:", error);
    res.status(500).json({ message: "Erro ao obter os computadores" });
  }
};

exports.adicionarComputador = function (req, res) {
  res.render("cadastroComputador", {
    identificacao: "",
    disponivel: true,
  });
};

exports.cadastrarComputador = async function (req, res) {
  if (!req.body) {
    res
      .status(400)
      .send({ message: "Os dados do computador são obrigatórios." });
    return;
  }

  const { identificacao, disponivel } = req.body;

  // Criar uma nova instância do modelo Computadores
  const novoComputador = new Computadores({
    identificacao: identificacao,
    disponivel: disponivel,
  });

  try {
    // Salvar o novo computador no banco de dados
    const computadorSalvo = await novoComputador.save();
    res.render("roothome"); // Corrigido o nome da página inicial
  } catch (error) {
    console.log(error); // Adicionado console.log para exibir o erro no console
    res.status(500).json({ message: "Erro ao cadastrar o computador." });
  }
};

exports.apagarComputador = async function (req, res) {
  try {
    const computadorId = req.params.id; // Obtém o ID do computador a ser apagado

    const filter = { _id: new ObjectId(computadorId) };

    const result = await Computadores.deleteOne(filter);

    if (result.deletedCount === 1) {
      res.renderx("roothome");
    } else {
      res.status(404).json({ message: "Registro não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao excluir o registro:", error);
    res.status(500).json({ message: "Erro ao excluir o registro" });
  }
};
