import * as Guid from 'Guid'
import { User } from './models/User'
import { Bill, BillType } from './models/Bill'
import { Calendar } from './google-calendar'
import * as randomstring from 'randomstring'
import * as crypto from 'crypto'
import * as express from 'express'
import * as mysql from 'mysql'
import { createDues } from './utility'
import googlepis from 'googleapis'


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

    // Bills //
    app.get('/bills/unpaid', (req, res) => {

        let loggedIn = req.isAuthenticated()

        if (loggedIn) {
            let name = req.user.firstname
            let userid = req.user.id
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
                        res.render(__dirname + '/views/unpaidbills', { bills: rows, loggedIn: loggedIn, name: name, userid: userid })
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
            connection.query(queryString, (err, rows: Array<any>) => {
                let due: number = 0
                let owed: number = 0
                let totalAmount: number = 0

                rows.forEach((row) => {
                    if (row.debtor_id == userid) {
                        due += parseFloat(row.amount)
                    } else {
                        owed += parseFloat(row.amount)
                    }
                })

                totalAmount = due - owed

                res.render(__dirname + '/views/dues', { display: "hide", loggedIn: loggedIn, name: name, dues: rows, userid: userid, due: due.toFixed(2), owed: owed.toFixed(2), totalAmount: totalAmount })
                connection.end()
            })
        } else {
            res.redirect('/login')
        }
    })

    app.get('/bills/dues/history', (req, res) => {
        let loggedIn = req.isAuthenticated()

        if (loggedIn) {
            res.render(__dirname + '/views/duepaymenthistory', { loggedIn: loggedIn, name: name })
        } else {
            res.redirect('/login')
        }
    })

    app.get('/bills/pay/:id', (req, res) => {

        let loggedIn = req.isAuthenticated()

        if (loggedIn) {
            let name = req.user.firstname
            let userid = req.user.id

            let queryString = "SELECT * FROM Bills WHERE id = '" + req.params.id + "';"
            let connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });

            connection.connect()
            connection.query(queryString, (err, rows: Array<any>) => {
                if (rows.length == 0) {
                    res.render(__dirname + '/views/404', { loggedIn: loggedIn, name: name })
                }
                else if (rows[0].owner == req.user.id) {
                    res.render(__dirname + '/views/paybill', { loggedIn: loggedIn, data: rows[0], name: name})
                } else {
                    res.render(__dirname + '/views/error')
                }
            })

            connection.end()
        } else {
            res.redirect('/login')
        }

    })

    app.post('/bills/pay', (req, res) => {

        let loggedIn = req.isAuthenticated()
        let name = req.user.firstname


        if (loggedIn) {
            let name = req.user.firstname
            let userid = req.user.id
            console.log(req.body)

            let queryString = "UPDATE Bills SET paid = 1, datePaid = '" + req.body.datepaid + "', paymentType = '" + req.body.paymenttype + "' WHERE id = '" + req.body.id + "';"
            let connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });

            connection.connect()
            connection.query(queryString, (err, rows: Array<any>) => {
                if (err) {
                    console.log(err)
                    res.render(__dirname + "/views/error")
                } else {
                    res.redirect('/bills/unpaid')
                }
            })
        }
    })

    app.get('/bills/create', (req, res) => {
        let loggedIn = req.isAuthenticated()
        let name = req.user.firstname


        if (loggedIn) {

            res.render(__dirname + '/views/createbill', { creditor: req.user, loggedIn: loggedIn , name:name })
        } else {
            res.redirect('/login')
        }
    })

    app.post('/bills/create', (req, res) => {
        let loggedIn = req.isAuthenticated()

        if (loggedIn) {
            let billid = Guid.create()
            let currency = "USD"

            let queryString = 'INSERT INTO Bills (id, duedate, type, currency, amount, paid, owner) VALUES ("' + billid + '","' + req.body.duedate + '","' + req.body.type + '","' + currency + '","' + req.body.amount + '", false, "' + req.user.id + '")'

            let connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });

            connection.connect()
            connection.query(queryString, (err, rows: Array<any>) => {

                if (err) {

                } else {

                    let query = createDues(billid, req)
                    connection.query(query, (err, rows: Array<any>) => {
                        if (err) {
                            console.log('There was an error creating the dues')
                            console.log(err)
                        } else {
                            res.render(__dirname + '/views/createbillsuccess', { display: "hide", loggedIn: loggedIn, billtype: req.body.type, billamount: req.body.amount, billduedate: req.body.duedate })
                        }

                    })

                }
                connection.end()
            })
        } else {
            res.redirect('/login')
        }
    })

    app.get('/bills/history', (req, res) => {
        let loggedIn = req.isAuthenticated()
        let name = req.user.firstname


        if (loggedIn) {
            let name = req.user.firstname
            let userid = req.user.id
            let queryString = 'SELECT * FROM BILLS WHERE paid = 1;'

            let connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });

            connection.connect()
            connection.query(queryString, (err, rows: Array<any>) => {
                if (err) {
                    res.render(__dirname + '/views/error', { loggedIn: loggedIn, name:name })
                } else {
                    rows.forEach( (bill) => {
                        let datePaid = new Date(bill.datePaid)
                        bill.datePaid = datePaid.toLocaleDateString()

                        let dueDate = new Date(bill.duedate)
                        bill.duedate = dueDate.toLocaleDateString()
                    })
                    res.render(__dirname + '/views/billpaymenthistory', { bills: rows, loggedIn: loggedIn, name:name })
                    console.log(rows)
                }
                connection.end()                
            })
        }
    })

    // Calendar //
    app.get('/calendar/event/create', (req, res) => {
        let loggedIn = req.isAuthenticated()
        let name = req.user.firstname
        let googleCalendar = new Calendar()
        let googleEvent:gapi.client.calendar.Event
        let startDate = new Date()
        let endDate = new Date()

        startDate.setHours(12)
        startDate.setMinutes(20)
        startDate.setFullYear(2018)
        startDate.setDate(4)
        startDate.setMonth(0)

        googleEvent.start.dateTime = startDate.toISOString()
        googleEvent.start.timeZone = "America/New_York"

        startDate.setHours(15)
        startDate.setMinutes(30)
        startDate.setFullYear(2018)
        startDate.setDate(6)
        startDate.setMonth(0)

        googleEvent.end.dateTime = endDate.toISOString()
        googleEvent.end.timeZone = "America/New_York"

        googleEvent.description = "This is an event entered from the API"
        googleEvent.summary = "Something Else"
        googleEvent.location = "559 Vine Avenue, Dunedin, FL 34698"


        if (loggedIn) {
            // googleCalendar.createNewEvent(startDate, endDate, googleEvent)
            res.render(__dirname + '/views/createevent', {loggedIn: loggedIn, name:name})
        } else {
            res.redirect('/login')
        }
    })

    app.post('/calendar/event/create', (req, res) => {
        let loggedIn = req.isAuthenticated()
        let googleCalendar = new Calendar()

        if (loggedIn) {
            
        } else {
            res.redirect('/login')
        }
    })



    // API //

    app.get('/api/users', (req, res) => {
        let loggedIn = req.isAuthenticated()
        if (loggedIn) {

            let queryString = 'SELECT firstname, lastname, id FROM Users WHERE id <> "' + req.user.id + '"'

            let connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });

            connection.connect()
            connection.query(queryString, (err, rows: Array<any>) => {

                res.json(JSON.stringify(rows))
                connection.end()
            });

        } else {
            res.send('You are not authorized to view this page')
        }
    })

    app.post('/api/bills/dues/pay', (req, res) => {
        let loggedIn = req.isAuthenticated()
        if (loggedIn) {
            let dueID: string = req.body.id
            let name: string = req.user.firstname
            let userid = req.user.id
            let queryString = 'UPDATE DUES SET paid = 1, datePaid = NOW() WHERE id = "' + req.body.id + '";'

            let connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });

            connection.connect()
            connection.query(queryString, (err, rows: Array<any>) => {

                if (err) { throw err }
                else {
                    let queryStringTwo = 'SELECT * FROM v_dues_information WHERE debtor_id = "' + req.user.id + '" OR creditor_id = "' + req.user.id + '"'

                    connection.query(queryStringTwo, (err, rows: Array<any>) => {
                        if (err) { throw err }
                        else {
                            let due: number = 0
                            let owed: number = 0
                            let totalAmount: number = 0

                            rows.forEach((row) => {
                                if (row.debtor_id == userid) {
                                    due += parseFloat(row.amount)
                                } else {
                                    owed += parseFloat(row.amount)
                                }
                            })

                            totalAmount = due - owed

                            res.json({ display: "hide", loggedIn: loggedIn, name: name, dues: rows, userid: userid, due: due.toFixed(2), owed: owed.toFixed(2), totalAmount: totalAmount })
                        }
                    });
                }

                connection.end()
            })
        } else {
            res.redirect('/login')
        }
    })

    app.post('/api/bills/dues/accept', (req, res) => {
        let loggedIn = req.isAuthenticated()
        if (loggedIn) {
            let dueID: string = req.body.id
            let name: string = req.user.firstname
            let userid = req.user.id
            let queryString = 'UPDATE DUES SET paymentAccepted = 1, dateAccepted = NOW() WHERE id = "' + req.body.id + '";'

            let connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });

            connection.connect()
            connection.query(queryString, (err, rows: Array<any>) => {

                if (err) { throw err }
                else {
                    let queryStringTwo = 'SELECT * FROM v_dues_information WHERE debtor_id = "' + req.user.id + '" OR creditor_id = "' + req.user.id + '"'

                    connection.query(queryStringTwo, (err, rows: Array<any>) => {
                        if (err) { throw err }
                        else {
                            let due: number = 0
                            let owed: number = 0
                            let totalAmount: number = 0

                            rows.forEach((row) => {
                                if (row.debtor_id == userid) {
                                    due += parseFloat(row.amount)
                                } else {
                                    owed += parseFloat(row.amount)
                                }
                            })

                            totalAmount = due - owed

                            res.json({ display: "hide", loggedIn: loggedIn, name: name, dues: rows, userid: userid, due: due.toFixed(2), owed: owed.toFixed(2), totalAmount: totalAmount })
                        }
                    });
                }

                connection.end()
            })
        } else {
            res.redirect('/login')
        }
    })

    return app
}


