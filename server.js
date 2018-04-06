var express = require("express");
var app = express();

var passport = require("passport");
var session = require("express-session");
var bodyParser = require("body-parser");
var PORT = process.env.PORT || 4005;
var exphbs = require("express-handlebars");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({secret: "somevaluablesecrets", resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

// Connect-Flash
var flash = require('connect-flash');

app.use(flash());

// Static Directory
app.use(express.static("public"));

app.set('views', __dirname + '/app/views');

var exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({
        defaultLayout: 'main', 
        extname: '.hbs',
        layoutsDir:'app/views/layouts',
        partialsDir:'app/views/partials'
}));
app.set('view engine', '.hbs');

var db = require("./app/models");
db.sequelize.sync().then(function() {
    console.log("Sequelize Connected!");
}).catch(function(err) {
    console.error("Something went wrong: ",err);
});


// console.log(app.get("views"));

app.use(function(req, res, next) {
    res.locals.user = req.user;
    if(!req.user){
        next();
    }else {
        next();
    }
});

// require("./app/routes/app.js")(app);
require("./app/routes/auth.js")(app, passport);
require("./app/config/passport/passport.js")(passport, db.user);

app.listen(PORT, function () {
	console.log("App listening on PORT " + PORT);
});

module.exports = app;
