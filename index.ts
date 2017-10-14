//Express Server
import * as express from 'express'
import { Bill, BillType } from './models/Bill'
import { User } from './models/User'
import * as Guid from 'Guid'
import * as randomstring from 'randomstring'
import * as passport from 'passport'
import * as mysql from 'mysql'
import * as bodyParser from 'body-parser'
import * as MySQLStore from 'express-mysql-session'
import * as expressSession from 'express-session'
import * as crypto from 'crypto'
import * as https from 'https'
import * as fs from 'fs'

import createApp from './app'
import setupRoutes from './routes'

let httpsPort = 3443

let httpsOptions = {
    key: fs.readFileSync('private.key'),
    cert: fs.readFileSync('certificate.pem')
}

let app = createApp()
setupRoutes(app)

app.set('port_https', 3443); // make sure to use the same port as above, or better yet, use the same variable

// Secure traffic only
app.all('*', function (req, res, next) {
    if (req.secure) {
        return next();
    };

    res.redirect('https://' + req.hostname + ':' + app.get('port_https') + req.url);
})

passport.serializeUser((user: User, done) => {
    done(null, user)
})

passport.deserializeUser((user: User, done) => {
    done(null, user)
})


// Listen for incoming HTTP requests
https.createServer(httpsOptions, app).listen(httpsPort);
