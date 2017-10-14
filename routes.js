"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Guid = require("Guid");
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
    app.get('/bills/unpaid', function (req, res) {
        var loggedIn = req.isAuthenticated();
        if (loggedIn) {
            var name_1 = req.user.firstname;
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
                        res.render(__dirname + '/views/unpaidbills', { bills: rows, loggedIn: loggedIn, name: name_1 });
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
            var userid_1 = req.user.id;
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
                    if (row.debtor_id == userid_1) {
                        due += parseFloat(row.amount);
                    }
                    else {
                        owed += parseFloat(row.amount);
                    }
                });
                totalAmount = due - owed;
                res.render(__dirname + '/views/dues', { display: "hide", loggedIn: loggedIn, name: name_2, dues: rows, userid: userid_1, due: due.toFixed(2), owed: owed.toFixed(2), totalAmount: totalAmount });
                connection_1.end();
            });
        }
        else {
            res.redirect('/login');
        }
    });
    app.post('/bills/dues/pay', function (req, res) {
    });
    app.get('/bills/create', function (req, res) {
        var loggedIn = req.isAuthenticated();
        if (loggedIn) {
            res.render(__dirname + '/views/createbill', { creditor: req.user });
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
            console.log(req.body.users);
            console.log(req.user);
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
    app.get('/api/users', function (req, res) {
        var loggedIn = req.isAuthenticated();
        if (loggedIn) {
            var queryString = 'SELECT firstname, lastname, id FROM Users WHERE id <> "' + req.user.id + '"';
            var connection_3 = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });
            connection_3.connect();
            connection_3.query(queryString, function (err, rows) {
                res.json(JSON.stringify(rows));
                connection_3.end();
            });
        }
        else {
            res.send('You are not authorized to view this page');
        }
    });
    app.get('/api/bills/dues', function (req, res) {
        var loggedIn = req.isAuthenticated();
        if (loggedIn) {
            var name_3 = req.user.firstname;
            var userid_2 = req.user.id;
            var queryString = 'SELECT * FROM v_dues_information WHERE debtor_id = "' + req.user.id + '" OR creditor_id = "' + req.user.id + '"';
            var connection_4 = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                database: 'dunedinhouse'
            });
            connection_4.connect();
            connection_4.query(queryString, function (err, rows) {
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
                res.json({ display: "hide", loggedIn: loggedIn, name: name_3, dues: rows, userid: userid_2, due: due.toFixed(2), owed: owed.toFixed(2), totalAmount: totalAmount });
                connection_4.end();
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