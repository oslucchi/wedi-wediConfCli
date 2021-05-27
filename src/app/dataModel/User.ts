export class User {
    idUser: number;
    token: string;
    firstName: string;
    lastName: string;
    organization: string;
    email: string;
    role: number; // 1 normal user ; 10 admin
    active: boolean;
    connectedOn: Date;

    constructor ()
    {
        this.idUser = 0;
        this.token = "";
        this.firstName = "";
        this.lastName = "";
        this.organization = "";
        this.email = "";
        this.active = false;
        this.role = 1;
        this.connectedOn = new Date();
    }
}