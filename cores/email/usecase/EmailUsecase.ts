import IEmailRepository from "../../email/repository/IEmailRepository";
import EmailDTO from "../dto/EmailDTO";
import EmailClient from "../../../libs/email/EmailClient";

export interface IEmailUsecase {
    SendEmail(email: EmailDTO): Promise<void>
    GetEmails(userID: string, startDate: Date, endDate: Date): Promise<EmailDTO[]>
}

export default class EmailUsecase implements IEmailUsecase {
    private readonly repository: IEmailRepository;
    private EmailClient: EmailClient;

    constructor(repository: IEmailRepository, emailClient: EmailClient) {
        this.EmailClient = emailClient;
        this.repository = repository;
    }

    public async SendEmail(email: EmailDTO): Promise<void> {
        await this.EmailClient.SendEmail(email.email, "Test Technical LNK", email.description);
        await this.repository.InsertUserEmail(email);
    }

    public async GetEmails(userID: string, startDate: Date, endDate: Date): Promise<EmailDTO[]> {
        return await this.repository.GetUserEmailsByDate(userID, startDate, endDate);
    }
}