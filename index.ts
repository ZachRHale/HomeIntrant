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

import createApp from './app'
import setupRoutes from './routes'

let app =  createApp()
setupRoutes(app)

passport.serializeUser((user: User, done) => {
    done(null, user)
})

passport.deserializeUser((user: User, done) => {
    done(null, user)
})


// Listen for incoming HTTP requests
app.listen(3000);