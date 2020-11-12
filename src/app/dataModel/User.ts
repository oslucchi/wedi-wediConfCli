export class User {
    idUser: number;
    token: string;
    firstName: string;
    lastName: string;
    organization: string;
    email: string;
    active: boolean;

    constructor ()
    {
        this.idUser = 0;
        this.token = "";
        this.firstName = "";
        this.lastName = "";
        this.organization = "";
        this.email = "";
        this.active = false;
    }
}