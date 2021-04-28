export class Session {
    sessionId: string;
    ipAddress: string;
    timestamp: Date

    constructor ()
    {
        this.sessionId = "";
        this.ipAddress = "";
        this.timestamp = new Date();
    }
}