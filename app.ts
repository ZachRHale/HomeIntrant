import * as randomstring from 'randomstring'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as MySQLStore from 'express-mysql-session'
import * as expressSession from 'express-session'
import * as passport from 'passport'
//Middleware
import * as pug from 'pug'

export default function createApp() {

    let app = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    //Setup our static location (aka wwwroot)
    app.use(express.static(__dirname + '/public'));
    //Set the view engine to do our rendering
    app.set('view engine', 'pug')

    var sessionSecret = randomstring.generate(20)

    let options = {
        host: 'localhost',
        user: 'root',
        database: 'dunedinhouse'
    }

    let sessionStore = new MySQLStore(options)

    app.use(expressSession({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        //cookie: { secure: true }
    }))

    app.use(passport.initialize())
    app.use(passport.session())

    return app
}
