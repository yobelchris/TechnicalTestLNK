import BaseError from "./BaseError";

export class DataNotFound extends BaseError {
    constructor(message: string = "data not found") {
        super(message, 404);
    }
}

export class DataNotUpdated extends BaseError {
    constructor(message: string = "data not updated") {
        super(message, 500);
    }
}