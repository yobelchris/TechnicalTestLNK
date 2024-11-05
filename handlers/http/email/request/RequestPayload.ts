import {z} from "zod";

export const SendEmailRequestValidation = z.object({
    email: z.string().trim().email(),
    date: z.string().trim().date(),
    description: z.string().trim()
});

export type SendEmailRequest = z.infer<typeof SendEmailRequestValidation>;

export const GetEmailRequestValidation = z.object({
    startDate: z.string().trim().date(),
    endDate: z.string().trim().date()
});

export type GetEmailRequest = z.infer<typeof GetEmailRequestValidation>;