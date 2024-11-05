import {IEmailUsecase} from "../../../cores/email/usecase/EmailUsecase";
import {Request, Response} from "express";
import StandardResponse from "../../../libs/response/StandardResponse";
import AuthenticatedRequest from "../../../libs/request/AuthenticatedRequest";
import BaseError from "../../../libs/errors/BaseError";
import {UserAuthError} from "../../../libs/errors/AuthError";
import {ConvertZodErrorToMapString} from "../../../libs/zod/Convert";
import {
    GetEmailRequest,
    GetEmailRequestValidation,
    SendEmailRequest,
    SendEmailRequestValidation
} from "./request/RequestPayload";
import EmailDTO from "../../../cores/email/dto/EmailDTO";
import {GetEmailsResponse} from "./response/ResponsePayload";


export default class EmailHandler {
    private emailUsecase: IEmailUsecase;

    constructor(emailUsecase: IEmailUsecase) {
        this.emailUsecase = emailUsecase;
    }

    public SendEmail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        let response: StandardResponse = new StandardResponse();
        let reqPayload: SendEmailRequest;
        try{
            const reqValidation = SendEmailRequestValidation.safeParse(req.body);

            if(!reqValidation.success) {
                response.message = "please check your payload";
                response.validationErrors = ConvertZodErrorToMapString(reqValidation.error);

                res.status(400).json(response.toObject());
                return;
            }

            reqPayload = reqValidation.data;
        }catch (e: any) {
            console.error("ERROR SEND EMAIL REQUEST VALIDATION : ", e)
            response.message = "validation error";
            res.status(500).json(response.toObject());
            return;
        }

        try {
            if(!req.user) {
                throw new UserAuthError();
            }

            await this.emailUsecase.SendEmail(new EmailDTO("", req.user.id, reqPayload.email, new Date(reqPayload.date), reqPayload.description));

            response.message = "send email success";
            res.status(200).json(response.toObject());
        }catch (e: any) {
            console.error("ERROR SENDING EMAIL : ", e);

            if(e instanceof BaseError) {
                response.message = e.message;
                res.status(e.statusCode).json(response.toObject());
                return;
            }

            response.message = "send email error";
            res.status(500).json(response.toObject());
            return;
        }
    }

    public GetEmail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        let response: StandardResponse = new StandardResponse();
        let reqPayload: GetEmailRequest;
        try{
            const reqValidation = GetEmailRequestValidation.safeParse(req.query);

            if(!reqValidation.success) {
                response.message = "please check your payload";
                response.validationErrors = ConvertZodErrorToMapString(reqValidation.error);

                res.status(400).json(response.toObject());
                return;
            }

            reqPayload = reqValidation.data;
        }catch (e: any) {
            console.error("ERROR GET EMAIL REQUEST VALIDATION : ", e)
            response.message = "validation error";
            res.status(500).json(response.toObject());
            return;
        }

        try {
            if(!req.user) {
                throw new UserAuthError();
            }

            const emails = await this.emailUsecase.GetEmails(req.user.id, new Date(reqPayload.startDate), new Date(reqPayload.endDate));

            response.message = "get email success";
            response.data = emails.map(email => {
                return new GetEmailsResponse(email.email, email.date.toISOString().split('T')[0], email.description);
            });
            res.status(200).json(response.toObject());
        }catch (e: any) {
            console.error("ERROR GETTING EMAIL : ", e);

            if(e instanceof BaseError) {
                response.message = e.message;
                res.status(e.statusCode).json(response.toObject());
                return;
            }

            response.message = "get email error";
            res.status(500).json(response.toObject());
            return;
        }
    }
}