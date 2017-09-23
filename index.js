"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Express Server
var express = require("express");
var Bill_1 = require("./models/Bill");
var User_1 = require("./models/User");
var Guid = require("Guid");
var mysql = require("mysql");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Setup our static location (aka wwwroot)
app.use(express.static(__dirname + '/public'));
//Set the view engine to do our rendering
app.set('view engine', 'pug');
//-------------
//Routing -----
//-------------
app.get('/', function (req, res) {
    res.render(__dirname + '/views/index', { title: 'Dunedin House Intranet' });
});
app.get('/test', function (req, res) {
    var ownerId = Guid.create();
    var billId = Guid.create();
    var date = new Date(2017, 11, 10);
    var testOwner = new User_1.User(ownerId, 'zhale', 'Zachary', 'Hale');
    var amount = { currency: 'USD', currencySystem: 'United States', value: (20.20).toString() };
    var billTest = new Bill_1.Bill(billId, Bill_1.BillType.electric, date, amount);
    res.json(billTest);
});
app.get('/create', function (req, res) {
    res.render(__dirname + '/views/create', {});
});
app.post('/createUser', function (req, res) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'dunedinhouse'
    });
    connection.connect();
    connection.query('SELECT * FROM Users', function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        console.log('The solution is: ', rows[0].firstname);
        console.log(req.body.stuff);
    });
    connection.end();
    res.send('done');
});
// Listen for incoming HTTP requests
app.listen(3000);
//# sourceMappingURL=index.js.map