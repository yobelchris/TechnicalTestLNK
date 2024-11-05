export default class StandardResponse {
    public message: string;
    public validationErrors?: Map<string, string>;
    public data?: any;

    constructor() {
        this.message = "";
    }

    public toObject() {
        return {
            message: this.message,
            validationErrors: this.validationErrors ? Object.fromEntries(this.validationErrors) : undefined,
            data: this.data,
        };
    }
}