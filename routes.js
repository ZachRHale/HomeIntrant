"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Guid = require("Guid");
var google_calendar_1 = require("./google-calendar");
var randomstring = require("randomstring");
var crypto = require("crypto");
var mysql = require("mysql");
var utility_1 = require("./utility");
function setupRoutes(app) {
    app.get('/', function (req, res) {
        var loggedIn = req.isAuthenticated();
        if (loggedIn) {
            var name = "";
            if (req.user) {
                name = req.user.firstname;
            }
            res.render(__dirname + '/views/index', { name: name, loggedIn: loggedIn, title: 'Dunedin House Intranet' });
        }
        else {
            res.redirect('/login');
        }
    });
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/?login=false');
    });
    app.get('/user/create', function (req, res) {
        res.render(__dirname + '/views/create', { display: "hide" });
    });
    app.get('/user/create/success', function (req, res) {
    });
    app.post('/user/create', function (req, res) {
        var theUser = req.body;
        var password = req.body.password;
        var saltone = randomstring.generate(7);
        var salttwo = randomstring.generate(13);
        var passwordNoHash = saltone + password + salttwo;
        var passwordHashed = crypto.createHmac('sha256', passwordNoHash).digest('hex');
        var id = Guid.create();
        var queryString = 'INSERT INTO Users (id, username, password, saltone, salttwo, firstname, lastname) VALUES ("' + id + '", "' + theUser.username + '", "' + passwordHashed + '", "' + saltone + '", "' + salttwo + '", "' + theUser.firstname + '", "' + theUser.lastname + '")';
        var responseText = 'no errors';
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'dunedinhouse'
        });
        connection.connect();
        connection.query(queryString, function (err, rows) {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    responseText = 'The username : ' + theUser.username + ' is already taken';
                }
                res.render(__dirname + '/views/create', { message: responseText, display: "show", firstname: theUser.firstname, lastname: theUser.lastname, username: theUser.username });
                connection.end();
            }
            else {
                res.render(__dirname + '/views/createsuccess', { username: theUser.username });
                connection.end();
            }
        });
    });
    app.post('/login', function (req, res) {
        var login = req.body;
        var saltone;
        var salttwo;
        var passwordNoHash;
        var passwordHashed;
        var queryString = 'SELECT saltone, salttwo FROM Users WHERE username = "' + login.username + '"';
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'dunedinhouse'
        });
        connection.connect();
        connection.query(queryString, function (err, rows) {
            if (err) {
                res.send(err);
                connection.end();
            }
            else {
                if (rows[0] != undefined) {
                    saltone = rows[0].saltone;
                    salttwo = rows[0].salttwo;
                    passwordNoHash = saltone + req.body.password + salttwo;
                    passwordHashed = crypto.createHmac('sha256', passwordNoHash).digest('hex');
                    var loginQueryString = 'SELECT id, firstname, lastname FROM Users WHERE username = "' + login.username + '" AND password = "' + passwordHashed + '"';
                    connection.query(loginQueryString, function (err, rows) {
                        if (err) {
                            res.send(err);
                        }
                        else {
                            if (rows[0] != undefined) {
                                var user = rows[0];
                                req.login(user, function (err) {
                                    res.redirect('/?login=true');
                                });
                            }
                            else {
                                res.send('Password is incorrect');
                            }
                        }
                    });
                }
                else {
                    res.send('Username is incorrect');
                }
            }
            connection.end();
        });
    });
    app.get('/login', function (req, res) {
        var loggedIn = req.isAuthenticated();
        res.render(__dirname + '/views/login', { display: "hide", loggedIn: loggedIn });
    });
    // Bills //
    app.get('/bills/unpaid', function (req, res) {
        var loggedIn = req.isAuthenticated();
        if (loggedIn) {
            var name_1 = req.user.firstname;
            var userid_1 = req.user.id;
            var connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });
            var queryString = 'SELECT * FROM Bills WHERE paid = 0';
            connection.connect();
            connection.query(queryString, function (err, rows) {
                if (err) {
                }
                else {
                    if (rows != undefined) {
                        res.render(__dirname + '/views/unpaidbills', { bills: rows, loggedIn: loggedIn, name: name_1, userid: userid_1 });
                    }
                }
            });
            connection.end();
        }
        else {
            res.redirect('/login');
        }
    });
    app.get('/bills/dues', function (req, res) {
        var loggedIn = req.isAuthenticated();
        if (loggedIn) {
            var name_2 = req.user.firstname;
            var userid_2 = req.user.id;
            var queryString = 'SELECT * FROM v_dues_information WHERE debtor_id = "' + req.user.id + '" OR creditor_id = "' + req.user.id + '"';
            var connection_1 = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });
            connection_1.connect();
            connection_1.query(queryString, function (err, rows) {
                var due = 0;
                var owed = 0;
                var totalAmount = 0;
                rows.forEach(function (row) {
                    if (row.debtor_id == userid_2) {
                        due += parseFloat(row.amount);
                    }
                    else {
                        owed += parseFloat(row.amount);
                    }
                });
                totalAmount = due - owed;
                res.render(__dirname + '/views/dues', { display: "hide", loggedIn: loggedIn, name: name_2, dues: rows, userid: userid_2, due: due.toFixed(2), owed: owed.toFixed(2), totalAmount: totalAmount });
                connection_1.end();
            });
        }
        else {
            res.redirect('/login');
        }
    });
    app.get('/bills/dues/history', function (req, res) {
        var loggedIn = req.isAuthenticated();
        if (loggedIn) {
            res.render(__dirname + '/views/duepaymenthistory', { loggedIn: loggedIn, name: name });
        }
        else {
            res.redirect('/login');
        }
    });
    app.get('/bills/pay/:id', function (req, res) {
        var loggedIn = req.isAuthenticated();
        if (loggedIn) {
            var name_3 = req.user.firstname;
            var userid = req.user.id;
            var queryString = "SELECT * FROM Bills WHERE id = '" + req.params.id + "';";
            var connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });
            connection.connect();
            connection.query(queryString, function (err, rows) {
                if (rows.length == 0) {
                    res.render(__dirname + '/views/404', { loggedIn: loggedIn, name: name_3 });
                }
                else if (rows[0].owner == req.user.id) {
                    res.render(__dirname + '/views/paybill', { loggedIn: loggedIn, data: rows[0], name: name_3 });
                }
                else {
                    res.render(__dirname + '/views/error');
                }
            });
            connection.end();
        }
        else {
            res.redirect('/login');
        }
    });
    app.post('/bills/pay', function (req, res) {
        var loggedIn = req.isAuthenticated();
        var name = req.user.firstname;
        if (loggedIn) {
            var name_4 = req.user.firstname;
            var userid = req.user.id;
            console.log(req.body);
            var queryString = "UPDATE Bills SET paid = 1, datePaid = '" + req.body.datepaid + "', paymentType = '" + req.body.paymenttype + "' WHERE id = '" + req.body.id + "';";
            var connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });
            connection.connect();
            connection.query(queryString, function (err, rows) {
                if (err) {
                    console.log(err);
                    res.render(__dirname + "/views/error");
                }
                else {
                    res.redirect('/bills/unpaid');
                }
            });
        }
    });
    app.get('/bills/create', function (req, res) {
        var loggedIn = req.isAuthenticated();
        var name = req.user.firstname;
        if (loggedIn) {
            res.render(__dirname + '/views/createbill', { creditor: req.user, loggedIn: loggedIn, name: name });
        }
        else {
            res.redirect('/login');
        }
    });
    app.post('/bills/create', function (req, res) {
        var loggedIn = req.isAuthenticated();
        if (loggedIn) {
            var billid_1 = Guid.create();
            var currency = "USD";
            var queryString = 'INSERT INTO Bills (id, duedate, type, currency, amount, paid, owner) VALUES ("' + billid_1 + '","' + req.body.duedate + '","' + req.body.type + '","' + currency + '","' + req.body.amount + '", false, "' + req.user.id + '")';
            var connection_2 = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });
            connection_2.connect();
            connection_2.query(queryString, function (err, rows) {
                if (err) {
                }
                else {
                    var query = utility_1.createDues(billid_1, req);
                    connection_2.query(query, function (err, rows) {
                        if (err) {
                            console.log('There was an error creating the dues');
                            console.log(err);
                        }
                        else {
                            res.render(__dirname + '/views/createbillsuccess', { display: "hide", loggedIn: loggedIn, billtype: req.body.type, billamount: req.body.amount, billduedate: req.body.duedate });
                        }
                    });
                }
                connection_2.end();
            });
        }
        else {
            res.redirect('/login');
        }
    });
    app.get('/bills/history', function (req, res) {
        var loggedIn = req.isAuthenticated();
        var name = req.user.firstname;
        if (loggedIn) {
            var name_5 = req.user.firstname;
            var userid = req.user.id;
            var queryString = 'SELECT * FROM BILLS WHERE paid = 1;';
            var connection_3 = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });
            connection_3.connect();
            connection_3.query(queryString, function (err, rows) {
                if (err) {
                    res.render(__dirname + '/views/error', { loggedIn: loggedIn, name: name_5 });
                }
                else {
                    rows.forEach(function (bill) {
                        var datePaid = new Date(bill.datePaid);
                        bill.datePaid = datePaid.toLocaleDateString();
                        var dueDate = new Date(bill.duedate);
                        bill.duedate = dueDate.toLocaleDateString();
                    });
                    res.render(__dirname + '/views/billpaymenthistory', { bills: rows, loggedIn: loggedIn, name: name_5 });
                    console.log(rows);
                }
                connection_3.end();
            });
        }
    });
    // Calendar //
    app.get('/calendar/event/create', function (req, res) {
        var loggedIn = req.isAuthenticated();
        var name = req.user.firstname;
        var googleCalendar = new google_calendar_1.Calendar();
        var googleEvent;
        var startDate = new Date();
        var endDate = new Date();
        startDate.setHours(12);
        startDate.setMinutes(20);
        startDate.setFullYear(2018);
        startDate.setDate(4);
        startDate.setMonth(0);
        googleEvent.start.dateTime = startDate.toISOString();
        googleEvent.start.timeZone = "America/New_York";
        startDate.setHours(15);
        startDate.setMinutes(30);
        startDate.setFullYear(2018);
        startDate.setDate(6);
        startDate.setMonth(0);
        googleEvent.end.dateTime = endDate.toISOString();
        googleEvent.end.timeZone = "America/New_York";
        googleEvent.description = "This is an event entered from the API";
        googleEvent.summary = "Something Else";
        googleEvent.location = "559 Vine Avenue, Dunedin, FL 34698";
        if (loggedIn) {
            // googleCalendar.createNewEvent(startDate, endDate, googleEvent)
            res.render(__dirname + '/views/createevent', { loggedIn: loggedIn, name: name });
        }
        else {
            res.redirect('/login');
        }
    });
    app.post('/calendar/event/create', function (req, res) {
        var loggedIn = req.isAuthenticated();
        var googleCalendar = new google_calendar_1.Calendar();
        if (loggedIn) {
        }
        else {
            res.redirect('/login');
        }
    });
    // API //
    app.get('/api/users', function (req, res) {
        var loggedIn = req.isAuthenticated();
        if (loggedIn) {
            var queryString = 'SELECT firstname, lastname, id FROM Users WHERE id <> "' + req.user.id + '"';
            var connection_4 = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });
            connection_4.connect();
            connection_4.query(queryString, function (err, rows) {
                res.json(JSON.stringify(rows));
                connection_4.end();
            });
        }
        else {
            res.send('You are not authorized to view this page');
        }
    });
    app.post('/api/bills/dues/pay', function (req, res) {
        var loggedIn = req.isAuthenticated();
        if (loggedIn) {
            var dueID = req.body.id;
            var name_6 = req.user.firstname;
            var userid_3 = req.user.id;
            var queryString = 'UPDATE DUES SET paid = 1, datePaid = NOW() WHERE id = "' + req.body.id + '";';
            var connection_5 = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });
            connection_5.connect();
            connection_5.query(queryString, function (err, rows) {
                if (err) {
                    throw err;
                }
                else {
                    var queryStringTwo = 'SELECT * FROM v_dues_information WHERE debtor_id = "' + req.user.id + '" OR creditor_id = "' + req.user.id + '"';
                    connection_5.query(queryStringTwo, function (err, rows) {
                        if (err) {
                            throw err;
                        }
                        else {
                            var due_1 = 0;
                            var owed_1 = 0;
                            var totalAmount = 0;
                            rows.forEach(function (row) {
                                if (row.debtor_id == userid_3) {
                                    due_1 += parseFloat(row.amount);
                                }
                                else {
                                    owed_1 += parseFloat(row.amount);
                                }
                            });
                            totalAmount = due_1 - owed_1;
                            res.json({ display: "hide", loggedIn: loggedIn, name: name_6, dues: rows, userid: userid_3, due: due_1.toFixed(2), owed: owed_1.toFixed(2), totalAmount: totalAmount });
                        }
                    });
                }
                connection_5.end();
            });
        }
        else {
            res.redirect('/login');
        }
    });
    app.post('/api/bills/dues/accept', function (req, res) {
        var loggedIn = req.isAuthenticated();
        if (loggedIn) {
            var dueID = req.body.id;
            var name_7 = req.user.firstname;
            var userid_4 = req.user.id;
            var queryString = 'UPDATE DUES SET paymentAccepted = 1, dateAccepted = NOW() WHERE id = "' + req.body.id + '";';
            var connection_6 = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });
            connection_6.connect();
            connection_6.query(queryString, function (err, rows) {
                if (err) {
                    throw err;
                }
                else {
                    var queryStringTwo = 'SELECT * FROM v_dues_information WHERE debtor_id = "' + req.user.id + '" OR creditor_id = "' + req.user.id + '"';
                    connection_6.query(queryStringTwo, function (err, rows) {
                        if (err) {
                            throw err;
                        }
                        else {
                            var due_2 = 0;
                            var owed_2 = 0;
                            var totalAmount = 0;
                            rows.forEach(function (row) {
                                if (row.debtor_id == userid_4) {
                                    due_2 += parseFloat(row.amount);
                                }
                                else {
                                    owed_2 += parseFloat(row.amount);
                                }
                            });
                            totalAmount = due_2 - owed_2;
                            res.json({ display: "hide", loggedIn: loggedIn, name: name_7, dues: rows, userid: userid_4, due: due_2.toFixed(2), owed: owed_2.toFixed(2), totalAmount: totalAmount });
                        }
                    });
                }
                connection_6.end();
            });
        }
        else {
            res.redirect('/login');
        }
    });
    return app;
}
exports.default = setupRoutes;
//# sourceMappingURL=routes.js.map