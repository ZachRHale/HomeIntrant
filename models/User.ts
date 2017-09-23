export class User {
    public id:any
    public username:string
    public firstname:string
    public lastname:string

    constructor(id:any, username:string, firstname:string, lastname:string){
        this.id = id
        this.username = username
        this.firstname = firstname
        this.lastname = lastname
    }
}
