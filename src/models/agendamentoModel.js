const mongoose = require("mongoose");

const agendamentoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "logins",
  },
  nome: {
    type: String,
    required: true,
  },
  serie: {
    type: String,
    required: true,
  },
  horario: {
    type: String,
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  periodo: {
    type: String,
    required: true,
  },
  computadorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Computadores",
  },
});

const Agendamento = mongoose.model("Agendamento", agendamentoSchema);

module.exports = Agendamento;
