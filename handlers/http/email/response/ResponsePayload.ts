export class GetEmailsResponse {
    email: string;
    date: string;
    description: string;

    constructor(email: string, date: string, description: string) {
        this.email = email;
        this.date = date;
        this.description = description;
    }
}