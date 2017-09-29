"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bill = /** @class */ (function () {
    function Bill(id, type, dueDate, amount, paid) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.duedate = dueDate;
        this.paid = paid;
    }
    return Bill;
}());
exports.Bill = Bill;
var BillType;
(function (BillType) {
    BillType[BillType["electric"] = 0] = "electric";
    BillType[BillType["water"] = 1] = "water";
    BillType[BillType["rent"] = 2] = "rent";
    BillType[BillType["internet"] = 3] = "internet";
})(BillType = exports.BillType || (exports.BillType = {}));
//# sourceMappingURL=Bill.js.map