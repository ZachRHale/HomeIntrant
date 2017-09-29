import { User } from './User'

export class Bill {

    public id:any
    public type:BillType
    public duedate:Date
    public amount:PaymentCurrencyAmount
    public paid:boolean

    constructor(id:any, type:BillType, dueDate:Date, amount:PaymentCurrencyAmount, paid:boolean){
        this.id = id
        this.type = type
        this.amount = amount
        this.duedate = dueDate
        this.paid = paid
    }
}

export enum BillType {
    electric = 0, 
    water = 1,
    rent = 2, 
    internet = 3
}
