var authController = require("../controllers/authcontroller.js");

module.exports = function(app, passport) {
    // Waits for a get request on /signup
    app.get("/", authController.index);
    app.get("/signup", authController.signup);

    // Looks for a post request on /signup then runs through passport
    app.post("/signup", passport.authenticate("local-signup", {
        successRedirect: "/user",
        failureRedirect: "/signup"
    }));

    // Waits for a get request for /user
    app.get("/user", isLoggedIn, authController.user);

    // Waits for a get request on /logout
    app.get("/logout", authController.logout);

    // Looks for a post request on /signin then runs passport
    app.post("/signin", passport.authenticate("local-signin", 
        {
            successRedirect: "/user",
            failureRedirect: "/signup"
        }
    ));

    function isLoggedIn(req, res, next) {
        if(req.isAuthenticated()) return next();
        res.redirect("/signup");
    }
}