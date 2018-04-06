var db = require("../models");
var exports = module.exports = {}

exports.signup = function(req, res) {
    var themessage = req.flash("signupMess")[0];
    console.log(themessage);
    res.render("signup", {error: themessage});
}

exports.index = function(req, res) {
    res.redirect("/signup");
}

exports.user = function(req, res) {
    // CAN PASS MORE THAN ONE OBJECT THROUGH RENDER
    res.render("user", {reqs: req.user, val: res.locals.user});
}

// Logout function!
exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect("/");
    });
}