export class CustomError extends Error {
    statusCode: number;
    errors?: any; // Optional errors object for validation errors, etc.

    constructor(statusCode: number, message: string, errors?: any) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.name = 'CustomError'; // Optional: Set error name for better identification
    }
}