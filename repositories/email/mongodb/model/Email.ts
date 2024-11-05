import {Schema, Document, Connection, Model} from "mongoose";
import EmailDTO from "../../../../cores/email/dto/EmailDTO";

interface IEmailModel extends Document {
    userID: string
    email: string
    date: Date
    description: string
    createdAt?: Date;
    updatedAt?: Date;
}

const EmailSchema = new Schema<IEmailModel>({
    userID: String,
    email: String,
    date: Date,
    description: String
},{
    timestamps: true
});

export default class Email {
    private readonly model: Model<IEmailModel>;

    constructor(conn: Connection) {
        this.model = conn.model<IEmailModel>("Email", EmailSchema);
    }

    public getModel(): Model<IEmailModel> {
        return this.model;
    }

    public ToCore(email: IEmailModel): EmailDTO {
        return new EmailDTO(email.id, email.userID, email.email, email.date, email.description, email.createdAt, email.updatedAt);
    }

    public FromCore(email: EmailDTO): IEmailModel {
        return new this.model({
            userID: email.userID,
            email: email.email,
            date: email.date,
            description: email.description,
            createdAt: email.createdAt,
            updatedAt: email.updatedAt
        });
    }
}