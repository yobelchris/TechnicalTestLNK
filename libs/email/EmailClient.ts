import nodemailer from 'nodemailer';

export default class EmailClient {
    private transporter: nodemailer.Transporter;

    constructor(email: string, password: string) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: password
            }
        });
    }

    public async SendEmail(to: string, subject: string, text: string): Promise<void> {
        await this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text
        });
    }
}