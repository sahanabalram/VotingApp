var bCrypt = require("bcrypt-nodejs");

module.exports = function(passport, user) {
    var User = user;
    var LocalStrategy = require("passport-local").Strategy;

    passport.serializeUser(function(user,done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function(user) {
            if(user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });

    passport.use("local-signup", new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
            passReqToCallback: true
        },
        function(req, username, password, done) {
            console.log("username: ",username);
            console.log("Req:",req.params.email);
            var generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };

            User.findOne({
                where: {
                    username: username
                }
            }).then(function(user) {
                if(user) {
                    return done(null,false, req.flash("signupMess", "Username is already taken!"));
                } else {
                    var userPassword = generateHash(password);
                    var data = {
                        username: username,
                        password: userPassword,
                        email: req.body.email
                    };
                    User.create(data).then(function(newUser, created) {
                        if(!newUser) {
                            return done(null, false);
                        }else if(newUser) {
                            return done(null, newUser);
                        }
                    });
                }
            });
        }
    ));

    passport.use("local-signin", new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
            passReqToCallback: true
        },
        function(req, username, password, done) {
            var User = user;
            console.log("Username: ",username);
            console.log("Password: ",password);
            var isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            }
            User.findOne({
                where: {
                    username: username
                }
            }).then(function(user) {
                if(!user) {
                    return (null, false, {message: "username does not exist!"});
                }else if(!isValidPassword(user.password, password)) {
                    return done(null, false, {message: "Incorrect Password!"});
                };
                var userinfo = user.get();
                return done(null, userinfo);
            }).catch(function(err) {
                console.error("Error: ", err);
                return done(null, false, {message: "Something went wrong with your Signin"});
            });
        }
    ));
}