import IEmailRepository from "../../../cores/email/repository/IEmailRepository";
import {Connection} from "mongoose";
import Email from "./model/Email";
import EmailDTO from "../../../cores/email/dto/EmailDTO";
import {DataNotFound} from "../../../libs/errors/DataError";

export default class EmailRepository implements IEmailRepository{
    private email: Email;

    constructor(conn: Connection) {
        this.email = new Email(conn);
    }

    public async InsertUserEmail(email: EmailDTO): Promise<void> {
        const emailModel = this.email.FromCore(email);
        await emailModel.save();
    }

    public async GetUserEmailsByDate(userID: string, startDate: Date, endDate: Date): Promise<EmailDTO[]> {
        const emails = await this.email.getModel().find({userID: userID, date: {$gte: startDate, $lte: endDate}}).sort({date: 1, email: 1});

        if(!emails) {
            throw new DataNotFound("emails not found");
        }

        return emails.map(email => this.email.ToCore(email));
    }
}