export default class UserDTO {
    id: string;
    userID: string;
    email: string;
    date: Date;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(id: string, userID: string, email: string, date: Date, description: string, createdAt?: Date, updatedAt?: Date) {
        this.id = id;
        this.userID = userID;
        this.email = email;
        this.date = date;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}