import { User } from './User'

export class Bill {

    public id:any
    public type:BillType
    public duedate:Date
    public amount:PaymentCurrencyAmount

    constructor(id:any, type:BillType, dueDate:Date, amount:PaymentCurrencyAmount){
        this.id = id
        this.type = type
        this.amount = amount
        this.duedate = dueDate
    }
}

export enum BillType {
    electric = 0, 
    water = 1,
    rent = 2, 
    internet = 3
}
