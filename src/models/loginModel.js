const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const loginSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  ra: {
    type: Number,
    required: true,
  },
  datanascimento: {
    type: Date,
    required: true,
  },
});

const loginModel = mongoose.model("Login", loginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.valida();
    if (this.errors.length > 0) return;
    this.user = await loginModel.findOne({ email: this.body.email });

    if (!this.user) {
      this.errors.push("Usuário não existe!");
      return;
    }

    if (!bcrypt.compareSync(this.body.senha, this.user.senha)) {
      this.errors.push("Senha Inválida!");
      this.user = null;
      return;
    }
  }

  async register() {
    this.valida();
    if (this.errors.length > 0) return;

    await this.userExists();
    if (this.errors.length > 0) return;

    const salt = bcrypt.genSaltSync();
    this.body.senha = bcrypt.hashSync(this.body.senha, salt);

    this.user = await loginModel.create(this.body);
  }

  async userExists() {
    this.user = await loginModel.findOne({ email: this.body.email });
    if (this.user) this.errors.push("Usuário já existente!");
  }

  valida() {
    this.cleanUp();

    // Validação
    // O email precisa ser válido
    if (!validator.isEmail(this.body.email)) this.errors.push("Email inválido");

    // A senha precisa ter entre 3 e 50 caracteres
    if (this.body.senha.length < 3 || this.body.senha.length > 50) {
      this.errors.push("A senha precisa ter entre 3 e 50 caracteres");
    }
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }

    this.body = {
      nome: this.body.nome,
      email: this.body.email,
      senha: this.body.senha,
      datanascimento: this.body.datanascimento,
      ra: this.body.ra,
    };
  }
}

module.exports = Login;
