export default class InternalServerError extends Error {
    constructor(message: string = "internal server error") {
        super(message);
        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
}