import * as Guid from 'Guid'

export function createDues(billid:string, req):string{

    let numberOfUser = req.body.users.creditor.length + req.body.users.debtor.length

    let amountOwed = parseFloat(req.body.amount) / numberOfUser

    let query = 'INSERT INTO Dues (id, bill, debtor, creditor, amount, paid, paymentAccepted) VALUES '

    req.body.users.debtor.forEach( (user, index) => {

        let dueId = Guid.create()

        if (index == (req.body.users.debtor.length - 1)) {
            query += '("'+ dueId + '", "' + billid + '","' + user + '", "' + req.body.users.creditor[0] + '", "' + amountOwed + '", 0, 0)'
        } else {
            query += '("'+ dueId + '", "' + billid + '","' + user + '", "' + req.body.users.creditor[0] + '", "' + amountOwed + '", 0, 0),'
        }
        
    })

    return query
}