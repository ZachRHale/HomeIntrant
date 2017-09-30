"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var passport = require("passport");
var https = require("https");
var fs = require("fs");
var app_1 = require("./app");
var routes_1 = require("./routes");
var httpsPort = 3443;
var httpsOptions = {
    key: fs.readFileSync('private.key'),
    cert: fs.readFileSync('certificate.pem')
};
var app = app_1.default();
routes_1.default(app);
app.set('port_https', 3443); // make sure to use the same port as above, or better yet, use the same variable
// Secure traffic only
app.all('*', function (req, res, next) {
    if (req.secure) {
        return next();
    }
    ;
    res.redirect('https://' + req.hostname + ':' + app.get('port_https') + req.url);
});
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
// Listen for incoming HTTP requests
https.createServer(httpsOptions, app).listen(httpsPort);
//# sourceMappingURL=index.js.map