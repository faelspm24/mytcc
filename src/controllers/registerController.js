const Login = require("../models/loginModel");

exports.index = (req, res) => {
  res.render("register", {
    errors: req.flash("errors"),
    success: req.flash("success"),
  });
};

exports.register = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.register();
    // ...

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(function () {
        res.render("register", {
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
