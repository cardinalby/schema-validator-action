export type ErrorType = 'file'|'schema'|'validation'|'';

export class SchemaValidatorError extends Error {
    public readonly errorType: ErrorType

    constructor(errorType: ErrorType, message?: string) {
        super(message);
        this.errorType = errorType;
    }
}