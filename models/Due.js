"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Due = /** @class */ (function () {
    function Due(debtor, creditor, bill, paid) {
        this.debtor = debtor.id;
        this.creditor = creditor.id;
        this.bill = bill.id;
        this.amount = bill.amount.value;
        this.paid = paid;
    }
    return Due;
}());
exports.Due = Due;
//# sourceMappingURL=Due.js.map