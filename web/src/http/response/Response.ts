export class StandardResponse<T> {
    public status: number;
    public message: string;
    public validationErrors?: Map<string, string>;
    public data?: T;

    constructor() {
        this.message = "";
        this.status = 0;
    }
}

export class LoginResponse {
    token: string
    refreshToken: string

    constructor(token: string, refreshToken: string) {
        this.token = token;
        this.refreshToken = refreshToken;
    }
}

export class GetEmailResponse {
    email: string
    date: string
    description: string

    constructor(email: string, date: string, description: string) {
        this.email = email;
        this.date = date;
        this.description = description;
    }
}

export class RefreshTokenResponse {
    token: string
    refreshToken: string
    constructor(token: string, refreshToken: string) {
        this.token = token;
        this.refreshToken = refreshToken;
    }
}