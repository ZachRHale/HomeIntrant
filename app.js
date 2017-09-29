"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var randomstring = require("randomstring");
var express = require("express");
var bodyParser = require("body-parser");
var MySQLStore = require("express-mysql-session");
var expressSession = require("express-session");
var passport = require("passport");
function createApp() {
    var app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    //Setup our static location (aka wwwroot)
    app.use(express.static(__dirname + '/public'));
    //Set the view engine to do our rendering
    app.set('view engine', 'pug');
    var sessionSecret = randomstring.generate(20);
    var options = {
        host: 'localhost',
        user: 'root',
        database: 'dunedinhouse'
    };
    var sessionStore = new MySQLStore(options);
    app.use(expressSession({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    return app;
}
exports.default = createApp;
//# sourceMappingURL=app.js.map