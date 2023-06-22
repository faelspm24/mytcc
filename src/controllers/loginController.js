const Login = require("../models/loginModel");

exports.index = (req, res) => {
  if (req.session.user)
    return res.render("home", {
      errors: req.flash("errors"),
      success: req.flash("success"),
    });
};

exports.login = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.login();
    // ...

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(function () {
        res.render("index", {
          errors: req.flash("errors"),
          success: req.flash("success"),
        });
      });
      return;
    }
    // ...
    req.session.user = login.user;
    req.session.save(function () {
      return res.render("home", { user: login.user });
    });
  } catch (e) {
    console.log(e);
    return res.render("404");
  }
};

exports.loginRequired = (req, res, next) => {
  if (!req.session.user) {
    req.flash("errors", "Você precisa estar logado.");
    req.session.save(() => res.redirect("/"));
    return;
  }

  next(); // Chama a próxima função de middleware ou rota
};

exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect("/");
};
