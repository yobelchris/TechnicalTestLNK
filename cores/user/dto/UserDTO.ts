export default class UserDTO {
    id: string;
    username: string;
    password: string;
    refreshToken: string;
    lastLogin: Date;
    lastLogout: Date;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(id: string, username: string, password: string, refreshToken: string, lastLogin: Date, lastLogout: Date, createdAt?: Date, updatedAt?: Date){
        this.id = id;
        this.username = username;
        this.password = password;
        this.refreshToken = refreshToken;
        this.lastLogin = lastLogin;
        this.lastLogout = lastLogout;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}