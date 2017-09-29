import * as Guid from 'Guid'
import { User } from './models/User'
import { Bill, BillType } from './models/Bill'
import * as randomstring from 'randomstring'
import * as crypto from 'crypto'
import * as express from 'express'
import * as mysql from 'mysql'


export default function setupRoutes(app: express.Application) {
    app.get('/', (req, res) => {
        let loggedIn = req.isAuthenticated()
        if (loggedIn) {
            var name = ""
            if (req.user) {
                name = req.user.firstname
            }
            res.render(__dirname + '/views/index', { name: name, loggedIn: loggedIn, title: 'Dunedin House Intranet' })

        } else {
            res.redirect('/login')
        }

    });

    app.get('/logout', (req, res) => {
        req.logout()
        res.redirect('/?login=false')
    })

    app.get('/user/create', function (req, res) {
        res.render(__dirname + '/views/create', { display: "hide" })
    })

    app.get('/user/create/success', (req, res) => {

    })

    app.post('/user/create', (req, res) => {
        var theUser: User = req.body
        var password: string = req.body.password
        var saltone: string = randomstring.generate(7)
        var salttwo: string = randomstring.generate(13)

        var passwordNoHash = saltone + password + salttwo
        var passwordHashed = crypto.createHmac('sha256', passwordNoHash).digest('hex')

        var id = Guid.create()
        var queryString = 'INSERT INTO Users (id, username, password, saltone, salttwo, firstname, lastname) VALUES ("' + id + '", "' + theUser.username + '", "' + passwordHashed + '", "' + saltone + '", "' + salttwo + '", "' + theUser.firstname + '", "' + theUser.lastname + '")'
        var responseText = 'no errors'

        let connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'dunedinhouse'
        });

        connection.connect()

        connection.query(queryString, (err, rows: Array<User>) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    responseText = 'The username : ' + theUser.username + ' is already taken'
                }
                res.render(__dirname + '/views/create', { message: responseText, display: "show", firstname: theUser.firstname, lastname: theUser.lastname, username: theUser.username })
                connection.end()
            } else {
                res.render(__dirname + '/views/createsuccess', { username: theUser.username })
                connection.end()
            }
        })
    })

    app.post('/login', (req, res) => {
        var login = req.body
        var saltone: string
        var salttwo: string
        var passwordNoHash: string
        var passwordHashed: string

        var queryString = 'SELECT saltone, salttwo FROM Users WHERE username = "' + login.username + '"'

        let connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'dunedinhouse'
        });

        connection.connect()
        connection.query(queryString, (err, rows) => {
            if (err) {
                res.send(err)
                connection.end()
            } else {
                if (rows[0] != undefined) {
                    saltone = rows[0].saltone
                    salttwo = rows[0].salttwo

                    passwordNoHash = saltone + req.body.password + salttwo
                    passwordHashed = crypto.createHmac('sha256', passwordNoHash).digest('hex')

                    var loginQueryString = 'SELECT id, firstname, lastname FROM Users WHERE username = "' + login.username + '" AND password = "' + passwordHashed + '"'

                    connection.query(loginQueryString, (err, rows) => {
                        if (err) {
                            res.send(err)
                        } else {
                            if (rows[0] != undefined) {
                                const user = rows[0]
                                req.login(user, (err) => {
                                    res.redirect('/?login=true')
                                })
                            } else {
                                res.send('Password is incorrect')
                            }
                        }
                    })
                } else {
                    res.send('Username is incorrect')
                }
            }
            connection.end()
        })
    })

    app.get('/login', (req, res) => {
        let loggedIn = req.isAuthenticated()
        res.render(__dirname + '/views/login', { display: "hide", loggedIn: loggedIn })
    })

    app.get('/bills/unpaid', (req, res) => {

        let loggedIn = req.isAuthenticated()

        if (loggedIn) {
            let name = req.user.firstname
            let connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });

            var queryString = 'SELECT * FROM Bills WHERE paid = 0'

            connection.connect()
            connection.query(queryString, (err, rows: Array<Bill>) => {
                if (err) {

                } else {
                    if (rows != undefined) {
                        res.render(__dirname + '/views/unpaidbills', { bills: rows, loggedIn: loggedIn, name: name })
                    }
                }
            })
            connection.end()
        } else {
            res.redirect('/login')
        }

    })

    app.get('/bills/dues', (req, res) => {
        let loggedIn = req.isAuthenticated()
        if (loggedIn) {
            let name = req.user.firstname
            let userid = req.user.id
            let queryString = 'SELECT * FROM v_dues_information WHERE debtor_id = "' + req.user.id + '" OR creditor_id = "' + req.user.id + '"'

            let connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });

            connection.connect()
            connection.query(queryString, (err, rows:Array<any>) => {   
                let due:number = 0
                let owed:number = 0
                let totalAmount:number = 0

                rows.forEach((row) => {
                    if (row.debtor_id == userid) {
                        due += parseFloat(row.amount)
                    } else {
                        owed += parseFloat(row.amount)
                    }
                })     

                totalAmount = due - owed

                res.render(__dirname + '/views/dues', { display: "hide", loggedIn: loggedIn, name: name, dues: rows, userid: userid, due:due.toFixed(2), owed:owed.toFixed(2), totalAmount:totalAmount })
                connection.end()
            })
        } else {
            res.redirect('/login')
        }
    })

    return app
}
