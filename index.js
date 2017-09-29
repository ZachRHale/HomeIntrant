"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var passport = require("passport");
var app_1 = require("./app");
var routes_1 = require("./routes");
var app = app_1.default();
routes_1.default(app);
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
// Listen for incoming HTTP requests
app.listen(3000);
//# sourceMappingURL=index.js.map