const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const admLoginSchema = new mongoose.Schema({
  nome: {
    type: String,
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
});

const admLogin = mongoose.model("Administradores", admLoginSchema);

class admUser {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.userAdm = null;
  }

  async login() {
    this.valida();
    if (this.errors.length > 0) return;

    this.userAdm = await admLogin.findOne({ email: this.body.email });

    if (!this.userAdm) {
      this.errors.push("Usuário não existe!");
      return;
    }

    const senhaValida = await bcrypt.compare(
      this.body.senha,
      this.userAdm.senha
    );

    if (!senhaValida) {
      this.errors.push("Senha Inválida!");
      this.userAdm = null;
      return;
    }
  }

  async register() {
    this.valida();
    if (this.errors.length > 0) return;

    await this.userExists();
    if (this.errors.length > 0) return;

    const salt = await bcrypt.genSalt();
    this.body.senha = await bcrypt.hash(this.body.senha, salt);

    this.userAdm = await admLogin.create(this.body);
  }

  async userExists() {
    this.userAdm = await admLogin.findOne({ email: this.body.email });
    if (this.userAdm) this.errors.push("Usuário já existente!");
  }

  valida() {
    this.cleanUp();

    // Validação
    // O email precisa ser válido
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
    };
  }
}

module.exports = admUser;
