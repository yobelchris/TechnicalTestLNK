export class LoginRequest {
    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}

export class SendEmailRequest {
    email: string;
    date: string;
    description: string;

    constructor(email: string, date: string, description: string) {
        this.email = email;
        this.date = date;
        this.description = description;
    }
}

export class GetEmailRequest {
    startDate: string;
    endDate: string;

    constructor(startDate: string, endDate: string) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
}