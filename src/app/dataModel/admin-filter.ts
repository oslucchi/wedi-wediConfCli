export class SearchFilters {
    email: string;
    active: string;
    fromDate: Date;
    toDate: Date;
    sessionFromDate: Date;
    sessionToDate: Date;

    SearchFilters()
    {
        this.email = "";
        this.active = "";
        this.fromDate = new Date();
        this.toDate = new Date();
        this.sessionFromDate = new Date();
        this.sessionToDate = new Date();
    }
}