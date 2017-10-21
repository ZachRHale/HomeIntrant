"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Guid = require("Guid");
function createDues(billid, req) {
    var numberOfUser = req.body.users.creditor.length + req.body.users.debtor.length;
    var amountOwed = parseFloat(req.body.amount) / numberOfUser;
    var query = 'INSERT INTO Dues (id, bill, debtor, creditor, amount, paid, paymentAccepted) VALUES ';
    req.body.users.debtor.forEach(function (user, index) {
        var dueId = Guid.create();
        if (index == (req.body.users.debtor.length - 1)) {
            query += '("' + dueId + '", "' + billid + '","' + user + '", "' + req.body.users.creditor[0] + '", "' + amountOwed + '", 0, 0)';
        }
        else {
            query += '("' + dueId + '", "' + billid + '","' + user + '", "' + req.body.users.creditor[0] + '", "' + amountOwed + '", 0, 0),';
        }
    });
    return query;
}
exports.createDues = createDues;
//# sourceMappingURL=utility.js.map