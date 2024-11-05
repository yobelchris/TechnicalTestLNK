import EmailDTO from "../dto/EmailDTO";

export default interface IEmailRepository {
    InsertUserEmail(email: EmailDTO): Promise<void>
    GetUserEmailsByDate(userID: string, startDate: Date, endDate: Date): Promise<EmailDTO[]>
}