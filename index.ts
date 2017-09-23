//Express Server
import * as express from 'express'
import { Bill, BillType } from './models/Bill'
import { User } from './models/User'
import * as Guid from 'Guid'
import * as mysql from 'mysql'



let app = express();

//Middleware
import * as pug from 'pug'
import * as bodyParser from 'body-parser'

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Setup our static location (aka wwwroot)
app.use(express.static(__dirname + '/public'));
//Set the view engine to do our rendering
app.set('view engine', 'pug')

//-------------
//Routing -----
//-------------
app.get('/', (req, res) => {
    res.render(__dirname + '/views/index', { title: 'Dunedin House Intranet' })
});

app.get('/test', (req, res) => {

    var ownerId = Guid.create()
    var billId = Guid.create()
    var date = new Date(2017, 11, 10);
    var testOwner = new User(ownerId, 'zhale', 'Zachary', 'Hale')

    var amount: PaymentCurrencyAmount = { currency: 'USD', currencySystem: 'United States', value: (20.20).toString() }
    var billTest = new Bill(billId, BillType.electric, date, amount)
    res.json(billTest)
});

app.get('/create', function (req, res) {
    res.render(__dirname + '/views/create', {})
});

app.post('/createUser', (req, res) => {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'dunedinhouse'
    });

    var id = Guid.create()

    var queryString = 'INSERT INTO Users (id, username, password, firstname, lastname) VALUES (' + id + ', "' + req.body.username + '", "whatever", "' + + req.body.firstname + '", "Hale")'

    connection.connect()

    connection.query('SELECT * FROM Users', (err, rows: Array<User>, fields) => {
        if (err) throw err

        console.log('The solution is: ', rows[0].firstname)
        console.log(req.body.stuff)
    })

    connection.end()

    res.send('done')

})

// Listen for incoming HTTP requests
app.listen(3000);