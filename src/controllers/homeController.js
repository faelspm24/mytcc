exports.index = (req, res) => {
  return res.render("index", {
    errors: req.flash("errors"),
    success: req.flash("success"),
  });
};
