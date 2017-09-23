import { User } from './User'
import { Bill } from './Bill'

export class Due {

    public bill:string
    public debtor:string
    public creditor:string
    public amount:string
    public paid:boolean

    constructor(debtor:User, creditor:User, bill:Bill, paid:boolean){
        this.debtor = debtor.id
        this.creditor = creditor.id
        this.bill = bill.id
        this.amount = bill.amount.value
        this.paid = paid
    }
}
