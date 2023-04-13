// TODO: Finish implementing custom error, or optimize computations and keep previous error handling
// Product has it, should others too?

export class CustomError {
    static CreateError({statusCode = 400, name= "Error", cause, message, code = 4}) {
        const error = new Error(message);
        error.statusCode = statusCode;
        error.name = name;
        error.code = code;
        error.cause = cause;
        throw error;
    }
}

export const ErrorCodes = {
    MISSING_DATA: 1,
    NOT_CREATED: 2, 
    INTERNAL_SERVER: 3,
    BAD_REQUEST: 4,
    NOT_FOUND: 5
}

export class GenerateErrorInfo {

    static getId(id) {
        return `Should I get the messages from here?`;
    }
}