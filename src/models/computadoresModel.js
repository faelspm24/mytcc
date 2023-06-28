const mongoose = require("mongoose");

const computadoresSchema = new mongoose.Schema({
  disponivel: {
    type: Boolean,
    default: true,
  },
  identificacao: {
    type: Number,
  },
});

const Computadores = mongoose.model("Computadores", computadoresSchema);

module.exports = Computadores;
