import BaseError from "./BaseError";

export class UserAuthError extends BaseError {
    constructor(message: string = "not authorized") {
        super(message, 401);
    }
}